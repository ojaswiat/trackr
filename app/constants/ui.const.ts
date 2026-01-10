export const PUBLIC_ROUTES = [
    ROUTE_INDEX,
    ROUTE_SIGNIN,
    ROUTE_ABOUT,
    ROUTE_TOS,
    ROUTE_PRIVACY,
];

export const UI_SIDE_NAV: Record<TSideNavRoutes, TUISideNavItem> = {
    [ROUTE_DASHBOARD]: {
        name: "Dashboard",
        route: ROUTE_DASHBOARD,
        icon: "i-lucide:layout-dashboard",
    },
    [ROUTE_ACCOUNTS]: {
        name: "Accounts",
        route: ROUTE_ACCOUNTS,
        icon: "i-lucide:wallet",
    },
    [ROUTE_TRANSACTIONS]: {
        name: "Transactions",
        route: ROUTE_TRANSACTIONS,
        icon: "i-lucide:notepad-text",
    },
} as const;
