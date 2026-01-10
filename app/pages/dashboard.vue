<template>
    <div class="w-full flex flex-col gap-8">
        <DashboardFilters
            v-model:selected-account="selectedAccount"
            :accounts="accounts"
        />
        <DashboardSummary
            :summary="summary"
            :date-range="dateRange"
        />
        <DashboardAccounts
            v-model:selected-account="selectedAccount"
            :accounts="accounts"
        />

        <div class="grid grid-cols-2 gap-4">
            <CategoryExpenses
                :selected-account="selectedAccountItem"
            />
            <AccountSummary
                :accounts="accounts.slice(1)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { find } from "lodash-es";

definePageMeta({
    title: "Dashboard",
    description: "Welcome back! Here's your financial overview.",
    layout: "new",
});

useHead({
    title: "Dashboard",
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

// TODO: default to all
const selectedAccount = ref<string>("acc_000");

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts || [];
});

const selectedAccountItem = computed(() => {
    return find(accounts.value, (account) => account.id === selectedAccount.value) as TAccount;
});

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
