<template>
    <div
        class="bg-warning/10 border-b border-warning px-4 py-2 text-center">
        <p class="text-sm text-warning">
            <Icon
                name="i-lucide-info"
                class="inline"
            />
            You're viewing a demo account with read-only access.
            <NuxtLink
                :to="ROUTE_SIGNIN"
                class="underline font-semibold">
                Sign up for free
            </NuxtLink> to create your own account!
        </p>
    </div>
</template>
