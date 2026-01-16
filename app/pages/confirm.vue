<template>
    <div>Redirecting you to the app...</div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

watch(user, async () => {
    if (user.value) {
        // Redirect to /home instead of default '/'
        await nextTick();
        navigateTo(ROUTE_DASHBOARD);
    }
}, { immediate: true });
</script>
