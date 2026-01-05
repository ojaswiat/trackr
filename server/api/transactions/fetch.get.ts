import transactionData from "../../../data/transaction.json";

export default defineEventHandler(() => {
    return transactionData.transactions
})