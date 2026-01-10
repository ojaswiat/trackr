<template>
    <header class="w-full flex flex-col gap-2">
        <h1 class="text-4xl font-bold">
            {{ metaTitle || 'Dashboard' }}
        </h1>
        <p class="text-muted">
            {{ metaDescription || "Welcome back! Here's your financial overview." }}
        </p>
    </header>
</template>

<script setup lang="ts">
const route = useRoute();

const metaTitle = computed(() => route.meta.title as string);
const metaDescription = computed(() => route.meta.description as string);
</script>
