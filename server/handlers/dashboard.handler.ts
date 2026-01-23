import type { TTransactionType } from "~~/shared/constants/enums";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "~~/server/utils/db";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";
import { accounts, transactions } from "~~/shared/db/schema";
import { getCategoryStatistics } from "./category.handler";

export async function getDashboardData(userId: string, filters?: { startDate?: Date; endDate?: Date; accountIds?: string[] }) {
    // 1. Calculate Net Worth
    // Sum of accounts initial balance
    const accountsConditions = [eq(accounts.user_id, userId)];
    if (filters?.accountIds && filters.accountIds.length > 0) {
        accountsConditions.push(inArray(accounts.id, filters.accountIds));
    }

    const accountsResult = await db
        .select({
            totalInitial: sql<number>`COALESCE(SUM(${accounts.initial_balance}), 0)`,
        })
        .from(accounts)
        .where(and(...accountsConditions));

    const initialBalanceSum = Number(accountsResult[0]?.totalInitial || 0);

    // Sum of transactions (Income - Expense)
    const transactionsConditions = [eq(transactions.user_id, userId)];
    if (filters?.accountIds && filters.accountIds.length > 0) {
        transactionsConditions.push(inArray(transactions.account_id, filters.accountIds));
    }

    const transactionsResult = await db
        .select({
            type: transactions.type,
            total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(and(...transactionsConditions))
        .groupBy(transactions.type);

    let totalIncome = 0;
    let totalExpense = 0;

    transactionsResult.forEach((t) => {
        if (t.type === TRANSACTION_TYPE.INCOME) {
            totalIncome = Number(t.total);
        }
        if (t.type === TRANSACTION_TYPE.EXPENSE) {
            totalExpense = Number(t.total);
        }
    });

    const netWorth = initialBalanceSum + totalIncome - totalExpense;

    // 2. Period Overview (Default to current month if no filters)
    const now = new Date();
    // Use transaction_date for period filtering
    const startOfPeriod = filters?.startDate ?? new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfPeriod = filters?.endDate ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const periodConditions = [
        eq(transactions.user_id, userId),
        gte(transactions.transaction_date, startOfPeriod),
        lte(transactions.transaction_date, endOfPeriod),
    ];
    if (filters?.accountIds && filters.accountIds.length > 0) {
        periodConditions.push(inArray(transactions.account_id, filters.accountIds));
    }

    const periodTransactionsResult = await db
        .select({
            type: transactions.type,
            total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(and(...periodConditions))
        .groupBy(transactions.type);

    let periodIncome = 0;
    let periodExpense = 0;

    periodTransactionsResult.forEach((t) => {
        if (t.type === TRANSACTION_TYPE.INCOME) {
            periodIncome = Number(t.total);
        }
        if (t.type === TRANSACTION_TYPE.EXPENSE) {
            periodExpense = Number(t.total);
        }
    });

    // 3. Recent Activity (Filtered by date if provided)
    const recentActivityConditions = [eq(transactions.user_id, userId)];
    if (filters?.startDate) {
        recentActivityConditions.push(gte(transactions.transaction_date, filters.startDate));
    }
    if (filters?.endDate) {
        recentActivityConditions.push(lte(transactions.transaction_date, filters.endDate));
    }
    if (filters?.accountIds && filters.accountIds.length > 0) {
        recentActivityConditions.push(inArray(transactions.account_id, filters.accountIds));
    }

    // Get recent transactions irrespective or the account selected
    const recentTransactions = await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.transaction_date))
        .limit(5);

    const categoryStats = await getCategoryStatistics(userId, filters?.accountIds, { startDate: startOfPeriod, endDate: endOfPeriod });

    return {
        netWorth,
        monthlyOverview: {
            income: periodIncome,
            expense: periodExpense,
        },
        recentTransactions: recentTransactions.map((t) => ({
            id: t.id,
            type: t.type as TTransactionType,
            category_id: t.category_id,
            account_id: t.account_id || "",
            amount: Number(t.amount),
            description: t.description,
            transaction_date: t.transaction_date.toISOString(),
            created_at: t.created_at.toISOString(),
            updated_at: t.updated_at.toISOString(),
        })),
        categoryBreakdown: categoryStats,
    };
}
