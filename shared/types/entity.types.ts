import type { TCategoryType, TTransactionType } from "../constants/enums";

export type TAccount = {
    id: string;
    name: string;
    description?: string;
    color?: string;

    // TODO: get this from group by query on transaction from DB
    total_income?: number;
    total_expense?: number;
};

export type TCategory = {
    id: string;
    name: string;
    description: string;
    color: string;
    type: TCategoryType;

    // TODO: get this from group by query on transaction from DB
    total_amount?: number;
};

export type TTransaction = {
    id: string;
    type: TTransactionType;
    category_id: string;
    account_id: string;
    amount: number;
    description: string;
    created_at: string;
    updated_at: string;
};
