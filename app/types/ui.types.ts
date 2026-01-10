export type TTransactionUI = TTransaction & { category_name?: string; category_color?: string };

export type TDashboardSummary = {
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
