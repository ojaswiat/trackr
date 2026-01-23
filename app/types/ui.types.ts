import type { TServerStatusCode } from "~~/shared/constants/enums";

export type TTransactionUI = TTransaction & { category_name?: string; category_color?: string };

export type TAccountSummary = {
    total_income: number;
    total_expense: number;
};

export type TDateRange = {
    startDate: string;
    endDate: string;
};

export type TUISideNavItem = {
    name: string;
    route: string;
    icon: string;
};

export type TAPIResponseSuccess<TData> = {
    statusCode: TServerStatusCode;
    statusMessage: string;
    message: string;
    data: TData;
};

export type TAPIResponseError = {
    statusCode: TServerStatusCode;
    statusMessage: string;
    message: string;
};

export type TCurrency = {
    id: string;
    country: string;
    symbol: string;
    flag: string;
};
