export const ACCOUNTS_FETCH = "/api/accounts/fetch";
export const CATEGORIES_FETCH = "/api/categories/fetch";
export const TRANSACTIONS_FETCH = "/api/transactions/fetch";
export const CATEGORIES_EXPENSE_FETCH = "/api/categories/expenses";

export const ROUTE_INDEX = "/";
export const ROUTE_CONFIRM = "/confirm";
export const ROUTE_DASHBOARD = "/dashboard";
export const ROUTE_SIGNIN = "/signin";

// TODO: Implment these pages
export const ROUTE_ACCOUNTS = "/accounts";
export const ROUTE_TRANSACTIONS = "/transactions";
export const ROUTE_ABOUT = "/about";
export const ROUTE_TOS = "/tos";
export const ROUTE_PRIVACY = "/privacy";

export type TSideNavRoutes = typeof ROUTE_DASHBOARD | typeof ROUTE_ACCOUNTS | typeof ROUTE_TRANSACTIONS;
