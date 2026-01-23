<template>
    <div class="flex flex-col gap-16 pb-4 h-screen bg-white dark:bg-neutral-800">
        <div class="flex gap-4 items-start text-primary px-8">
            <UIcon
                name="i-lucide:book-text"
                class="w-10 h-10 shadow-md"
            />
            <p class="flex-shrink-0 text-4xl font-bold">
                trackr.
            </p>
        </div>

        <UButton
            class="mx-8 hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer"
            icon="i-lucide:plus"
            size="xl"
            @click="emits('onAddTransaction')">
            New Transaction
        </UButton>

        <div
            class="flex flex-col gap-3">
            <NuxtLink
                v-for="routeItem, route in UI_SIDE_NAV_LINKS"
                :key="`route-${route}`"
                class="cursor-pointer"
                :class="{
                    'text-black bg-primary font-semibold': isRouteActive($route.path, route),
                    'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50': !isRouteActive($route.path, route),
                }"
                :to="route">
                <div
                    class="flex items-center gap-3 bg-transparent px-4 py-3"
                    :class="{
                        'transition-all duration-200 ease-in-out hover:translate-x-2': !isRouteActive($route.path, route),
                    }">
                    <UIcon
                        :name="routeItem.icon"
                        class="w-5 h-5"
                    />
                    <p class="text-base font-medium">
                        {{ routeItem.name }}
                    </p>
                </div>
            </NuxtLink>
        </div>

        <div class="mt-auto grid">
            <UButton
                v-for="buttonItem in UI_SIDE_NAV_BUTTONS"
                :key="`button-${buttonItem.route}`"
                class="cursor-pointer mb-4"
                :icon="buttonItem.icon"
                variant="ghost"
                :ui="{
                    base: 'rounded-none py-3 px-4 transition-all duration-200 ease-in-out hover:translate-x-2 hover:bg-transparent',
                }"
                :to="buttonItem.route"
                @click="buttonItem.onClick">
                {{ buttonItem.name }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const emits = defineEmits(["onAddTransaction"]);

const UI_SIDE_NAV_LINKS = {
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

const UI_SIDE_NAV_BUTTONS = {
    [ROUTE_PROFILE]: {
        name: "Profile",
        route: ROUTE_PROFILE,
        icon: "i-lucide:user",
        onClick: () => {},
    },
    [ROUTE_HELP]: {
        name: "Help",
        route: ROUTE_HELP,
        icon: "i-lucide:help-circle",
        onClick: () => {},
    },
    [ROUTE_SIGNIN]: {
        name: "Sign out",
        route: ROUTE_SIGNIN,
        icon: "i-lucide:log-out",
        onClick: handleSignOut,
    },
} as const;

const supabase = useSupabaseClient();
const router = useRouter();

async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout error:", error);
        return;
    }

    await router.push(ROUTE_SIGNIN); // or homepage
}

function isRouteActive(
    currentPath: string,
    route: keyof typeof UI_SIDE_NAV_LINKS,
): boolean {
    // For other routes, check if current path starts with the route value
    return currentPath === route || currentPath.startsWith(`${route}/`);
}
</script>
