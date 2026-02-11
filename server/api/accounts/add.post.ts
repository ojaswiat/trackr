import type { TTransaction, TUser } from "~~/shared/types/entity.types";
import { getLocalTimeZone, today } from "@internationalized/date";
import { isEmpty } from "lodash-es";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { addAccountForUser, checkCanUserAddAccount } from "~~/server/handlers/account.handler";
import { getIncomeCategory, getOthersCategory } from "~~/server/handlers/category.handler";
import { addTransactionForUser } from "~~/server/handlers/transaction.handler";
import { isDev } from "~~/server/utils/api.utils";
import { APP_CONFIG } from "~~/shared/constants/config.const";
import { SERVER_STATUS_CODES, TRANSACTION_TYPE } from "~~/shared/constants/enums";
import { ZAddAccountSchema } from "~~/shared/schemas/zod.schema";

export default defineEventHandler(async (event) => {
    const dev = isDev();

    try {
        const user = event.context.user as TUser;
        const body = await readBody(event);
        const result = ZAddAccountSchema.safeParse(body);

        if (!result.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid input",
                data: result.error.issues,
            });
        }

        const canAdd = await checkCanUserAddAccount(user.id);

        if (!canAdd) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: `User can only have ${APP_CONFIG.MAX_ACCOUNTS_PER_USER} accounts!`,
            });
        }

        // const newAccountInitialBalance = result.data.initial_balance ?? 0;
        const newAccount = await addAccountForUser(user.id, result.data);

        // Didn't create a transaction: the initial balance as an expense may overlap all the categories.
        // let transaction = {} as TTransaction;

        // if (!isEmpty(newAccount)) {
        //     const thisDay = today(getLocalTimeZone());
        //     const thisDate = new Date(thisDay.toString());

        //     if (newAccount.initial_balance !== 0) {
        //         transaction = await addTransactionForUser(user.id, {
        //             account_id: newAccount.id,
        //             category_id: newAccountInitialBalance < 0 ? await getOthersCategory() : await getIncomeCategory(),
        //             type: newAccountInitialBalance < 0 ? TRANSACTION_TYPE.EXPENSE : TRANSACTION_TYPE.INCOME,
        //             amount: Math.abs(newAccountInitialBalance),
        //             description: "Initial balance",
        //             transaction_date: thisDate.toISOString(),
        //         });
        //     }
        // }

        return {
            statusCode: SERVER_STATUS_CODES.CREATED,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.CREATED],
            message: "Account created successfully!",
            data: {
                account: newAccount,
                // transaction,
            },
        };
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
