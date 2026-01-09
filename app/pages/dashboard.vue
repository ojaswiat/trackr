<template>
    <div class="w-full flex flex-col gap-8">
        <DashboardFilters :accounts="accounts" />
        <DashboardSummary
            :summary="summary"
            :date-range="dateRange"
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: "Dashboard",
    description: "Welcome back! Here's your financial overview.",
    layout: "new",
});

useHead({
    title: "Dashboard",
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const accounts = computed(() => accountsResponse.value?.data?.accounts || []);

// TODO: remove mock data
const summary = computed(() => ({
    total_income: 10000,
    total_expense: 5000,
}));

const dateRange = computed(() => ({
    startDate: "20 Dec 2025",
    endDate: "20 Jan 2026",
}));
</script>
