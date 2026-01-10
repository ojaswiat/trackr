import type { TAccount } from "~~/shared/types/entity.types";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/api";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import accountsData from "../../../data/account.json";

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const accountId = query.account_id as string | undefined;

    const allAccounts = accountsData.accounts as TAccount[];

    // If account_id is provided, return only that account
    if (accountId) {
        const account = allAccounts.find((acc) => acc.id === accountId);
        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Account fetched successfully",
            data: {
                accounts: account ? [account] : [],
            },
        };
    }

    // If no account_id is provided, create a pseudo "all accounts" object
    const allAccountsSummary: TAccount = {
        // TODO: get this from data base
        id: "acc_000",
        name: "All Accounts",
        description: "Combined view of all accounts",
        color: "#333333",
        total_income: allAccounts.reduce((acc, curr) => acc + (curr.total_income ?? 0), 0), // TODO: get this from group by query on transaction from DB
        total_expense: allAccounts.reduce((acc, curr) => acc + (curr.total_expense ?? 0), 0), // TODO: get this from group by query on transaction from DB
    };

    // Return the pseudo "all accounts" object followed by individual accounts
    return {
        statusCode: SERVER_STATUS_CODES.OK,
        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
        message: "Accounts fetched successfully",
        data: {
            accounts: [allAccountsSummary, ...allAccounts],
        },
    };
});
