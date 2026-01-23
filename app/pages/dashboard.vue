<template>
    <div class="flex flex-col gap-8">
        <DashboardFilters
            v-model:selected-account="selectedAccount"
            v-model:selected-date-range="selectedDateRange"
            class="px-4"
            :accounts="accounts"
            :loading="loading"
            @refresh="refreshDashboardData"
        />

        <DashboardSummary
            class="px-4"
            :summary="summary"
        />
        <DashboardAccounts
            v-model:selected-account="selectedAccount"
            class="mx-4"
            :accounts="accounts"
        />

        <div class="grid grid-cols-2 gap-4 px-4">
            <CategoryExpenses :categories="categoryBreakdown" />
            <AccountSummary :accounts="accounts.slice(1)" />
        </div>

        <div class="px-4">
            <TransactionRecentList :transactions="recentTransactions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getLocalTimeZone, today } from "@internationalized/date";
import { ACCOUNTS_FETCH, DASHBOARD_FETCH } from "~~/shared/constants/api.const";
import { DEFAULT_ALL_ACCOUNT_ID } from "~~/shared/constants/data.const";

definePageMeta({
    title: "Dashboard",
    description: "Welcome back! Here's your financial overview",
    layout: "app",
});

useHead({
    title: "Dashboard",
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const selectedAccount = ref<string>(DEFAULT_ALL_ACCOUNT_ID);

const selectedDateRange = ref({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
});

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts || [];
});

const { data: dashboardData, pending: loading, refresh: refreshDashboardData } = await useAsyncData(
    () => `dashboard-${selectedAccount.value}-${selectedDateRange.value.start}-${selectedDateRange.value.end}`,
    () => $fetch(DASHBOARD_FETCH, {
        query: {
            startDate: selectedDateRange.value.start.toString(),
            endDate: selectedDateRange.value.end.toString(),
            account_id: selectedAccount.value === DEFAULT_ALL_ACCOUNT_ID ? undefined : selectedAccount.value,
        },
    }),
    { watch: [() => selectedAccount.value, () => selectedDateRange.value] },
);

const summary = computed(() => {
    return {
        total_income: dashboardData.value?.data?.monthlyOverview?.income || 0,
        total_expense: dashboardData.value?.data?.monthlyOverview?.expense || 0,
    };
});

const recentTransactions = computed(() => {
    return dashboardData.value?.data?.recentTransactions || [];
});

const categoryBreakdown = computed(() => {
    return dashboardData.value?.data?.categoryBreakdown || [];
});

onMounted(async () => {
    await refreshDashboardData();
});
</script>
