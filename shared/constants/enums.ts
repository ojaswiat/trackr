export const TRANSACTION_TYPE = {
    INCOME: 0,
    EXPENSE: 1,
} as const;

export type TTransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export const CATEGORY_TYPE = {
    INCOME: 0,
    EXPENSE: 1,
} as const;

export type TCategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

export const SERVER_STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
};

export type TServerStatusCode = (typeof SERVER_STATUS_CODES)[keyof typeof SERVER_STATUS_CODES];
