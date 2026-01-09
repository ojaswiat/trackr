import type { TCategoryType, TTransactionType } from "../constants/enums";

export type TAccount = {
    id: string;
    name: string;
    description: string;
    color: string;
};

export type TAccountList = TAccount[];

export type TCategory = {
    id: string;
    name: string;
    description: string;
    color: string;
    type: TCategoryType;
};

export type TCategoryList = TCategory[];

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

export type TTransactionList = TTransaction[];
