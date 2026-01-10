import { includes, isEmpty } from "lodash-es";

export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();
    const isLoggedIn = !isEmpty(user);

    if (!includes(PUBLIC_ROUTES, to.path)) {
        if (isLoggedIn) {
            if (to.path === ROUTE_CONFIRM) {
                return navigateTo(ROUTE_DASHBOARD);
            } else if (to.path === ROUTE_SIGNIN) {
                return navigateTo(ROUTE_DASHBOARD);
            }
        } else {
            if (to.path !== ROUTE_SIGNIN) {
                return navigateTo(ROUTE_SIGNIN);
            }
        }
    }
});
