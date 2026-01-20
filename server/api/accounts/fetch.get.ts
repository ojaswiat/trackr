import type { TUser } from "~~/shared/types/entity.types";
import process from "node:process";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";

import {
    checkAccountBelongsToUser,
    checkAccountExist,
    getAccountDetails,
    getAllAccountsForUser,
} from "~~/server/handlers/account.handler";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export default defineEventHandler(async (event) => {
    const dev = process.env.NODE_ENV === "development";

    try {
        const query = getQuery(event);
        const user = event.context.user as TUser;

        const accountId = query.account_id as string | undefined;
        const { id: userId } = user;

        // If account_id is provided, return only that account
        if (accountId) {
            const accountExists = await checkAccountExist(accountId);

            if (!accountExists) {
                throw createError({
                    statusCode: SERVER_STATUS_CODES.NOT_FOUND,
                    statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.NOT_FOUND],
                    message: "Account not found!",
                });
            } else {
                const accountBelongsToUser = await checkAccountBelongsToUser(accountId, userId);
                if (!accountBelongsToUser) {
                    throw createError({
                        statusCode: SERVER_STATUS_CODES.FORBIDDEN,
                        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
                        message: "You're not allowed to access this account!",
                    });
                } else {
                    const account = await getAccountDetails(accountId);
                    return {
                        statusCode: SERVER_STATUS_CODES.OK,
                        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
                        message: "Account details fetched successfully!",
                        data: {
                            account,
                        },
                    };
                }
            }
        } else {
            const accounts = await getAllAccountsForUser(userId);
            return {
                statusCode: SERVER_STATUS_CODES.OK,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
                message: "Accounts fetched successfully!",
                data: {
                    accounts,
                },
            };
        }
    } catch (error) {
        if (dev) {
            console.error(error);
        }

        throw createError({
            statusCode: SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR],
            message: "Internal server error!",
        });
    }
});
