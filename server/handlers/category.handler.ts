import type { TCategoryType } from "~~/shared/constants/enums";
import type { TCategory } from "~~/shared/types/entity.types";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "~~/server/utils/db";
import { CATEGORY_TYPE, TRANSACTION_TYPE } from "~~/shared/constants/enums";
import { categories, transactions } from "~~/shared/db/schema";

export async function checkCategoryExists(categoryId: string): Promise<boolean> {
    const result = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, categoryId));

    return result.length > 0;
}

export async function getIncomeCategory(): Promise<string> {
    const result = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.type, CATEGORY_TYPE.INCOME))
        .limit(1);

    if (!result?.[0]?.id) {
        throw new Error("No income category present!");
    } else {
        return result[0].id;
    }
}

export async function getAllCategories(): Promise<TCategory[]> {
    const result = await db.select().from(categories);
    return result as TCategory[];
}

export async function getCategoryStatistics(
    userId: string,
    accountIds?: string[],
    filters?: { startDate?: Date; endDate?: Date },
): Promise<TCategory[]> {
    const txConditions = [
        eq(transactions.user_id, userId),
        eq(transactions.type, TRANSACTION_TYPE.EXPENSE),
    ];

    if (accountIds && accountIds.length > 0) {
        txConditions.push(inArray(transactions.account_id, accountIds));
    }

    if (filters?.startDate) {
        txConditions.push(gte(transactions.transaction_date, filters.startDate));
    }
    if (filters?.endDate) {
        txConditions.push(lte(transactions.transaction_date, filters.endDate));
    }

    const sq = db
        .select({
            category_id: transactions.category_id,
            total: sql<number>`sum(${transactions.amount})`.as("total"),
        })
        .from(transactions)
        .where(and(...txConditions))
        .groupBy(transactions.category_id)
        .as("sq");

    const result = await db
        .select({
            id: categories.id,
            name: categories.name,
            description: categories.description,
            color: categories.color,
            type: categories.type,
            total_amount: sql<number>`COALESCE(${sq.total}, 0)`,
        })
        .from(categories)
        .leftJoin(sq, eq(categories.id, sq.category_id))
        .where(eq(categories.type, CATEGORY_TYPE.EXPENSE));

    return result.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        color: c.color,
        type: c.type as TCategoryType,
        total_amount: Number(c.total_amount),
    }));
}
