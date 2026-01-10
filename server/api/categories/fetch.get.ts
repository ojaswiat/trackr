// Fetch all expenses categories only

import categoriesData from "~~/data/category.json";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/api";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export default defineEventHandler(() => {
    return {
        statusCode: SERVER_STATUS_CODES.OK,
        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
        message: "Categories fetched successfully",
        data: {
            categories: categoriesData.categories,
        },
    };
});
