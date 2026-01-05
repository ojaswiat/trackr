import reduce from "lodash/reduce";
import accountsData from "../../../data/account.json";

export default defineEventHandler(() => {
    // Todo: Aggreate query on DB for total values

    const totalExpense = reduce(accountsData.accounts, (sum, account) => {
        sum += account.total_expense;
        return sum;
    }, 0);

    const totalIncome = reduce(accountsData.accounts, (sum, account) => {
        sum += account.total_income;
        return sum;
    }, 0);

    const allAccount = {
        description: "Your total activity accross all the accounts",
        id: "acc_000",
        name: "All Accounts",
        total_expense: totalExpense,
        total_income: totalIncome,
    };

    return [allAccount, ...accountsData.accounts];
});
