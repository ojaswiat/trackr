import type { TServerStatusCode } from "~~/shared/constants/enums";
import { API_ACCOUNTS, API_TRANSACTIONS, API_USER, CATEGORIES_FETCH } from "~~/shared/constants/api.const";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export const STATUS_CODE_MESSAGE_MAP: Record<TServerStatusCode, string> = {
    [SERVER_STATUS_CODES.OK]: "OK",
    [SERVER_STATUS_CODES.CREATED]: "Created",
    [SERVER_STATUS_CODES.BAD_REQUEST]: "Bad request",
    [SERVER_STATUS_CODES.NOT_FOUND]: "Not found",
    [SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR]: "Internal server error",
    [SERVER_STATUS_CODES.UNAUTHORIZED]: "Unauthorized",
    [SERVER_STATUS_CODES.FORBIDDEN]: "Forbidden",
};

export const PROTECTED_ROUTES = [
    API_ACCOUNTS,
    CATEGORIES_FETCH,
    API_TRANSACTIONS,
    API_USER,
];
