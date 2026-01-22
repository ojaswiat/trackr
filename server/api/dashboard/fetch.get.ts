import type { TUser } from "~~/shared/types/entity.types";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { getDashboardData } from "~~/server/handlers/dashboard.handler";
import { isDev } from "~~/server/utils/api.utils";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export default defineEventHandler(async (event) => {
    const dev = isDev();

    try {
        const user = event.context.user as TUser;
        const { id: userId } = user;

        const query = getQuery(event);
        const startDate = query.startDate ? new Date(String(query.startDate)) : undefined;
        const endDate = query.endDate ? new Date(String(query.endDate)) : undefined;
        const account_id = query.account_id ? String(query.account_id) : undefined;
        const accountIds = account_id ? [account_id] : undefined;

        const dashboardData = await getDashboardData(userId, { startDate, endDate, accountIds });

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Dashboard data fetched successfully",
            data: dashboardData,
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
