import type { TAccount } from "~~/shared/types/entity.types";
import { and, eq, gte, lte, sql, sum } from "drizzle-orm";
import { map, reduce } from "lodash-es";
import { db } from "~~/server/utils/db";
import { APP_CONFIG } from "~~/shared/constants/config.const";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";
import { accounts, transactions } from "~~/shared/db/schema";

// create a function to check if account exists
export async function checkAccountExists(accountId: string): Promise<boolean> {
    const result = await db
        .select({ id: accounts.id })
        .from(accounts)
        .where(eq(accounts.id, accountId));

    return result.length > 0;
}

// create a function to check if account belongs to the user
export async function checkAccountBelongsToUser(accountId: string, userId: string): Promise<boolean> {
    const result = await db
        .select({ id: accounts.id })
        .from(accounts)
        .where(and(eq(accounts.id, accountId), eq(accounts.user_id, userId)));

    return result.length > 0;
}

// create a function to get account details:
export async function getAccountDetails(accountId: string): Promise<TAccount> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));

    if (!account) {
        throw new Error("Account not found");
    }

    const totals = await db
        .select({
            type: transactions.type,
            total: sum(transactions.amount),
        })
        .from(transactions)
        .where(eq(transactions.account_id, accountId))
        .groupBy(transactions.type);

    let total_income = 0;
    let total_expense = 0;

    totals.forEach((t) => {
        if (t.type === TRANSACTION_TYPE.INCOME) {
            total_income = Number(t.total);
        }
        if (t.type === TRANSACTION_TYPE.EXPENSE) {
            total_expense = Number(t.total);
        }
    });

    return {
        id: account.id,
        name: account.name,
        description: account.description,
        color: account.color,
        initial_balance: Number(account.initial_balance),
        total_income,
        total_expense,
    };
}

// create a function to get all accounts for a user
export async function getAllAccountsForUser(userId: string): Promise<TAccount[]> {
    const result = await db
        .select({
            account: accounts,
            total_income: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = ${TRANSACTION_TYPE.INCOME} THEN ${transactions.amount} ELSE 0 END), 0)`,
            total_expense: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = ${TRANSACTION_TYPE.EXPENSE} THEN ${transactions.amount} ELSE 0 END), 0)`,
        })
        .from(accounts)
        .leftJoin(transactions, eq(accounts.id, transactions.account_id))
        .where(eq(accounts.user_id, userId))
        .groupBy(accounts.id);

    const accountsWithTotals = map(result, ({ account, total_income, total_expense }) => ({
        id: account.id,
        name: account.name,
        description: account.description,
        color: account.color,
        initial_balance: Number(account.initial_balance),
        total_income: Number(total_income),
        total_expense: Number(total_expense),
    }));

    return accountsWithTotals;
}

export async function checkCanUserAddAccount(userId: string): Promise<boolean> {
    const existingAccountsCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(accounts)
        .where(eq(accounts.user_id, userId));

    return Number(existingAccountsCount[0]?.count ?? 0) < APP_CONFIG.MAX_ACCOUNTS_PER_USER;
}

// create a function to add account for a user
export async function addAccountForUser(
    userId: string,
    payload: {
        name: string;
        initial_balance: number;
        color: string;
        description?: string;
    },
): Promise<TAccount> {
    const [newAccount] = await db
        .insert(accounts)
        .values({
            name: payload.name,
            user_id: userId,
            description: payload.description || "",
            color: payload.color,
            initial_balance: String(payload.initial_balance),
        })
        .returning();

    if (!newAccount) {
        throw new Error("Failed to create account");
    }

    return {
        id: newAccount.id,
        name: newAccount.name,
        description: newAccount.description,
        color: newAccount.color,
        initial_balance: Number(newAccount.initial_balance),
        total_income: 0,
        total_expense: 0,
    };
}

export async function updateAccountForUser(
    userId: string,
    payload: {
        id: string;
        name: string;
        initial_balance: number;
        color: string;
        description?: string;
    },
): Promise<TAccount> {
    await db
        .update(accounts)
        .set({
            name: payload.name,
            description: payload.description || "",
            color: payload.color,
            initial_balance: String(payload.initial_balance),
        })
        .where(and(eq(accounts.id, payload.id), eq(accounts.user_id, userId)));

    return getAccountDetails(payload.id);
}

export async function deleteAccountForUser(userId: string, accountId: string, keepTransactions: boolean): Promise<TAccount> {
    const accountToDelete = await getAccountDetails(accountId);

    if (!keepTransactions) {
        await db.delete(transactions).where(eq(transactions.account_id, accountId));
    }

    await db.delete(accounts).where(and(eq(accounts.id, accountId), eq(accounts.user_id, userId)));

    return accountToDelete;
}

export async function getAccountTransactionHistory(accountId: string): Promise<{
    date: string;
    income: number;
    expense: number;
}[]> {
    // Get date range: last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Query transactions for this account in the last 30 days
    const result = await db
        .select({
            transaction_date: transactions.transaction_date,
            type: transactions.type,
            amount: transactions.amount,
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.account_id, accountId),
                gte(transactions.transaction_date, startDate),
                lte(transactions.transaction_date, endDate),
            ),
        )
        .orderBy(transactions.transaction_date);

    // Group by date and aggregate income/expense
    const groupedData = new Map<string, { income: number; expense: number }>();

    result.forEach((tx) => {
        const date = tx.transaction_date;
        const dateKey = `${date.getDate().toString().padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]}`;

        if (!groupedData.has(dateKey)) {
            groupedData.set(dateKey, { income: 0, expense: 0 });
        }

        const data = groupedData.get(dateKey)!;
        const amount = Number(tx.amount);

        if (tx.type === TRANSACTION_TYPE.INCOME) {
            data.income += amount;
        } else if (tx.type === TRANSACTION_TYPE.EXPENSE) {
            data.expense += amount;
        }
    });

    // Convert to array format expected by the chart
    // Fill in missing dates with zero values for continuity
    const chartData: { date: string; income: number; expense: number }[] = [];
    const currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate.getTime() <= finalDate.getTime()) {
        const dateKey = `${currentDate.getDate().toString().padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currentDate.getMonth()]}`;

        const data = groupedData.get(dateKey) || { income: 0, expense: 0 };
        chartData.push({
            date: dateKey,
            income: Number(data.income.toFixed(2)),
            expense: Number(data.expense.toFixed(2)),
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartData;
}
