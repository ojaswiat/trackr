import type { TCategoryType } from "~~/shared/constants/enums";
import type { TCategory } from "~~/shared/types/entity.types";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { filter, map } from "lodash-es";
import { db } from "~~/server/utils/db";
import { DEFAULT_ALL_CATEGORY_ID } from "~~/shared/constants/data.const";
import { CATEGORY_TYPE, TRANSACTION_TYPE } from "~~/shared/constants/enums";
import { categories, transactions } from "~~/shared/db/schema";

export async function getAllCategories(): Promise<TCategory[]> {
    const result = await db.select().from(categories);

    const allCategories = map(result, (cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || "",
        color: cat.color,
        type: cat.type as TCategoryType,
        total_amount: 0,
    }));

    const defaultAllCategory = {
        id: DEFAULT_ALL_CATEGORY_ID,
        name: "All Categories",
        description: "All categories",
        color: "#90a1b9",
        type: CATEGORY_TYPE.EXPENSE,
        total_amount: 0,
    };

    const noIncomeCategory = filter(allCategories, (cat) => cat.type !== CATEGORY_TYPE.INCOME);

    return [
        defaultAllCategory,
        ...noIncomeCategory,
    ];
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
