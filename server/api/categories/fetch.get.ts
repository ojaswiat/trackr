import reduce from "lodash/reduce";
import categoriesData from "../../../data/category.json";
import { CATEGORY_TYPE } from "../../../shared/constants/enums";

export default defineEventHandler(() => {
    // Todo: Aggreate query on DB for total values
    const totalAmount = reduce(categoriesData.categories, (sum, category) => {
        // Skip income
        if (category.type === CATEGORY_TYPE.INCOME) {
            return 0;
        }

        // Only sum expenses
        sum += category.total_ammount;
        return sum;
    }, 0);

    const allCategory = {
        description: "Your total expenses accross all the categories",
        id: "acc_000",
        name: "All Categories",
        total_amount: totalAmount,
    };

    return [allCategory, ...categoriesData.categories];
});
