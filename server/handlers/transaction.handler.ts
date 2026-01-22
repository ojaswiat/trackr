import type { TTransaction } from "~~/shared/types/entity.types";
import { and, desc, eq, gte, lt, lte } from "drizzle-orm";
import { db } from "~~/server/utils/db";
import { transactions } from "~~/shared/db/schema";

export async function checkTransactionExists(transactionId: string): Promise<boolean> {
    const result = await db
        .select({ id: transactions.id })
        .from(transactions)
        .where(eq(transactions.id, transactionId));

    return result.length > 0;
}

export async function checkTransactionBelongsToUser(transactionId: string, userId: string): Promise<boolean> {
    const result = await db
        .select({ id: transactions.id })
        .from(transactions)
        .where(and(eq(transactions.id, transactionId), eq(transactions.user_id, userId)));

    return result.length > 0;
}

export async function canUserUpdateTransaction(transactionId: string, userId: string): Promise<boolean> {
    return checkTransactionBelongsToUser(transactionId, userId);
}

export async function getTransactionDetails(transactionId: string): Promise<TTransaction> {
    const [transaction] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, transactionId));

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    return {
        id: transaction.id,
        type: transaction.type as TTransaction["type"],
        category_id: transaction.category_id,
        account_id: transaction.account_id || "",
        amount: Number(transaction.amount),
        description: transaction.description,
        transaction_date: transaction.transaction_date.toISOString(),
        created_at: transaction.created_at.toISOString(),
        updated_at: transaction.updated_at.toISOString(),
    };
}

export async function getAllTransactionsForUser(
    userId: string,
    filters?: { account_id?: string; startDate?: Date; endDate?: Date },
    options?: { limit?: number; cursor?: string },
): Promise<{ data: TTransaction[]; meta: { next_cursor: string | null; has_more: boolean } }> {
    const limit = options?.limit ?? 20;
    const cursor = options?.cursor;

    const conditions = [];

    if (filters?.account_id) {
        conditions.push(eq(transactions.account_id, filters.account_id));
    } else {
        conditions.push(eq(transactions.user_id, userId));
    }

    if (filters?.startDate) {
        conditions.push(gte(transactions.transaction_date, filters.startDate));
    }

    if (filters?.endDate) {
        conditions.push(lte(transactions.transaction_date, filters.endDate));
    }

    if (cursor) {
        conditions.push(lt(transactions.transaction_date, new Date(cursor)));
    }

    const result = await db
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(desc(transactions.transaction_date))
        .limit(limit + 1);

    const hasMore = result.length > limit;
    const data = hasMore ? result.slice(0, limit) : result;
    const lastItem = data[data.length - 1];
    const nextCursor = hasMore && lastItem ? lastItem.transaction_date.toISOString() : null;

    const mappedData = data.map((t) => ({
        id: t.id,
        type: t.type as TTransaction["type"],
        category_id: t.category_id,
        account_id: t.account_id || "",
        amount: Number(t.amount),
        description: t.description,
        transaction_date: t.transaction_date.toISOString(),
        created_at: t.created_at.toISOString(),
        updated_at: t.updated_at.toISOString(),
    }));

    return {
        data: mappedData,
        meta: {
            next_cursor: nextCursor,
            has_more: hasMore,
        },
    };
}

export async function addTransactionForUser(
    userId: string,
    payload: {
        type: number;
        amount: number;
        category_id: string;
        account_id?: string;
        description: string;
        transaction_date: string;
        created_at?: string;
    },
): Promise<TTransaction> {
    const [newTransaction] = await db
        .insert(transactions)
        .values({
            user_id: userId,
            type: payload.type,
            amount: String(payload.amount),
            category_id: payload.category_id,
            account_id: payload.account_id,
            description: payload.description,
            transaction_date: new Date(payload.transaction_date),
            created_at: payload.created_at ? new Date(payload.created_at) : undefined,
        })
        .returning();

    if (!newTransaction) {
        throw new Error("Failed to create transaction");
    }

    return {
        id: newTransaction.id,
        type: newTransaction.type as TTransaction["type"],
        category_id: newTransaction.category_id,
        account_id: newTransaction.account_id || "",
        amount: Number(newTransaction.amount),
        description: newTransaction.description,
        transaction_date: newTransaction.transaction_date.toISOString(),
        created_at: newTransaction.created_at.toISOString(),
        updated_at: newTransaction.updated_at.toISOString(),
    };
}

export async function updateTransactionForUser(
    userId: string,
    payload: {
        id: string;
        type: number;
        amount: number;
        category_id: string;
        account_id?: string;
        description: string;
        transaction_date: string;
        created_at?: string;
    },
): Promise<TTransaction> {
    await db
        .update(transactions)
        .set({
            type: payload.type,
            amount: String(payload.amount),
            category_id: payload.category_id,
            account_id: payload.account_id,
            description: payload.description,
            transaction_date: new Date(payload.transaction_date),
            created_at: payload.created_at ? new Date(payload.created_at) : undefined,
        })
        .where(and(eq(transactions.id, payload.id), eq(transactions.user_id, userId)));

    return getTransactionDetails(payload.id);
}

export async function deleteTransactionForUser(userId: string, transactionId: string): Promise<TTransaction> {
    const transactionToDelete = await getTransactionDetails(transactionId);

    await db
        .delete(transactions)
        .where(and(eq(transactions.id, transactionId), eq(transactions.user_id, userId)));

    return transactionToDelete;
}
