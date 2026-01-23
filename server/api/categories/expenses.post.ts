import type { TUser } from "~~/shared/types/entity.types";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { getCategoryStatistics } from "~~/server/handlers/category.handler";
import { isDev } from "~~/server/utils/api.utils";
import { CATEGORY_TYPE, SERVER_STATUS_CODES } from "~~/shared/constants/enums";

type TRequestBody = {
    filters?: {
        account_id?: string[];
    };
};

export default defineEventHandler(async (event) => {
    const dev = isDev();
    try {
        const user = event.context.user as TUser;
        const body = (await readBody(event)) as TRequestBody;
        const accountIds = body.filters?.account_id ?? [];

        const allCategories = await getCategoryStatistics(user.id, accountIds);

        // Filter for EXPENSE type
        const categories = allCategories.filter((c) => c.type === CATEGORY_TYPE.EXPENSE);

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Category expenses fetched successfully",
            data: {
                categories,
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
