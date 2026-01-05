// Fetch all expenses categories only

import { filter } from "lodash-es";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/api";
import categoriesData from "../../../data/category.json";
import { CATEGORY_TYPE, SERVER_STATUS_CODES } from "../../../shared/constants/enums";

export default defineEventHandler(() => {
    const categories = filter(categoriesData.categories, (category) => category.type === CATEGORY_TYPE.EXPENSE);

    return {
        statusCode: SERVER_STATUS_CODES.OK,
        statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
        message: "Categories fetched successfully",
        data: categories,
    };
});
