import type { TServerStatusCode } from "~~/shared/constants/enums";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export const STATUS_CODE_MESSAGE_MAP: Record<TServerStatusCode, string> = {
    [SERVER_STATUS_CODES.OK]: "OK",
    [SERVER_STATUS_CODES.BAD_REQUEST]: "Bad request",
    [SERVER_STATUS_CODES.NOT_FOUND]: "Not found",
};
