// Category-wise expenses - per account, for scalability, account id is must

import type { TCategory } from "~~/shared/types/entity.types";
import { filter, find, forEach, isEmpty, reduce } from "lodash-es";
import accountsData from "~~/data/account.json";
import categoriesData from "~~/data/category.json";
import transactionsData from "~~/data/transaction.json";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/api";
import { CATEGORY_TYPE, SERVER_STATUS_CODES, TRANSACTION_TYPE } from "~~/shared/constants/enums";

export default defineEventHandler(async (event) => {
    const { account_id } = await readBody(event);

    // If there's no account id in the request
    if (!account_id) {
        throw createError({
            statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
            message: "Account ID required",
            data: { field: "account_id" },
        });
    }

    const allAccounts = accountsData.accounts;
    const account = find(allAccounts, (account) => account.id === account_id);

    // Account with the given account ID is not found
    if (isEmpty(account)) {
        throw createError({
            statusCode: SERVER_STATUS_CODES.NOT_FOUND,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.NOT_FOUND],
            message: "Account not found",
            data: { field: "account_id" },
        });
    }

    // Expenses for only this account
    const expenses = filter(transactionsData.transactions, (transaction) => {
        return transaction.type === TRANSACTION_TYPE.EXPENSE && transaction.account_id === account_id;
    });

    type TNewCategory = TCategory & { total_amount: number };

    const categories = filter(categoriesData.categories, (category) => category.type === CATEGORY_TYPE.EXPENSE) as TNewCategory[];
    forEach(categories, (category) => category.total_amount = 0);

    const categoryAmount: Record<string, number> = reduce(expenses, (accumulator, expense) => {
        if (!accumulator[expense.category_id]) {
            accumulator[expense.category_id] = expense.amount;
        } else {
            accumulator[expense.category_id] += expense.amount;
        }

        return accumulator;
    }, {} as Record<string, number>);

    forEach(categories, (category) => {
        category.total_ammount = categoryAmount[category.id];
    });

    return {
        statusCode: SERVER_STATUS_CODES.OK,
        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
        message: "Category expenses fetched successfully",
        data: categories,
    };
});
