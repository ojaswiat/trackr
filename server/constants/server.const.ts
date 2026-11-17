import type { TServerStatusCode } from "~~/shared/constants/enums";
import {
    ACCOUNTS_ADD,
    ACCOUNTS_DELETE,
    ACCOUNTS_UPDATE,
    API_ACCOUNTS,
    API_TRANSACTIONS,
    API_USER,
    CATEGORIES_FETCH,
    DASHBOARD_FETCH,
    DEMO_SIGNIN,
    TRANSACTIONS_ADD,
    TRANSACTIONS_DELETE,
    TRANSACTIONS_UPDATE,
    USER_DELETE,
    USER_UPDATE,
} from "~~/shared/constants/api.const";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export const STATUS_CODE_MESSAGE_MAP: Record<TServerStatusCode, string> = {
    [SERVER_STATUS_CODES.OK]: "OK",
    [SERVER_STATUS_CODES.CREATED]: "Created",
    [SERVER_STATUS_CODES.BAD_REQUEST]: "Bad request",
    [SERVER_STATUS_CODES.NOT_FOUND]: "Not found",
    [SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR]: "Internal server error",
    [SERVER_STATUS_CODES.UNAUTHORIZED]: "Unauthorized",
    [SERVER_STATUS_CODES.FORBIDDEN]: "Forbidden",
    [SERVER_STATUS_CODES.TOO_MANY_REQUESTS]: "Too many requests",
};

export const PROTECTED_ROUTES = [
    API_ACCOUNTS,
    CATEGORIES_FETCH,
    API_TRANSACTIONS,
    API_USER,
    DASHBOARD_FETCH,
];

// Auth endpoints that are rate limited per client IP (see server/middleware/00.rate-limit.ts)
export const AUTH_RATE_LIMITED_ROUTES = [
    DEMO_SIGNIN,
];

export const DEMO_PROTECTED_ROUTES = [
    ACCOUNTS_ADD,
    ACCOUNTS_UPDATE,
    ACCOUNTS_DELETE,
    TRANSACTIONS_ADD,
    TRANSACTIONS_UPDATE,
    TRANSACTIONS_DELETE,
    USER_UPDATE,
    USER_DELETE,
];
