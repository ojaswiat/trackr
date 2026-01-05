import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/api";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import accountsData from "../../../data/account.json";

export default defineEventHandler(() => {
    return {
        statusCode: SERVER_STATUS_CODES.OK,
        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
        message: "Accounts fetched successfully",
        data: {
            accounts: accountsData.accounts,
        },
    };
});
