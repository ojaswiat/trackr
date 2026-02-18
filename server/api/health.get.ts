import { sql } from "drizzle-orm";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { db } from "~~/server/utils/db";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

/**
 * Health check endpoint to keep Supabase active
 * Performs a simple DB query to prevent database from pausing
 */
export default defineEventHandler(async () => {
    try {
        // Simple query to check DB connection
        await db.execute(sql`SELECT 1`);

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Service healthy",
            data: {
                timestamp: new Date().toISOString(),
                database: "connected",
            },
        };
    } catch (error) {
        console.error("Health check failed:", error);

        throw createError({
            statusCode: SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage:
                STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR],
            message: "Health check failed",
        });
    }
});
