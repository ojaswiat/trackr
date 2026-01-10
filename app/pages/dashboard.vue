<template>
    <div class="w-full flex flex-col gap-8">
        <DashboardFilters
            v-model:selected-account="selectedAccount"
            v-model:selected-date-range="selectedDateRange"
            :accounts="accounts"
        />

        <DashboardSummary
            :summary="summary"
            :selected-date-range="selectedDateRange"
        />
        <DashboardAccounts
            v-model:selected-account="selectedAccount"
            :accounts="accounts"
        />

        <div class="grid grid-cols-2 gap-4">
            <CategoryExpenses
                :selected-account="selectedAccount"
            />
            <AccountSummary
                :accounts="accounts.slice(1)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
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

const selectedDateRange = ref<{ start: DateValue; end: DateValue }>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
});

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts || [];
});

const selectedAccountItem = computed(() => {
    return find(accounts.value, (account) => account.id === selectedAccount.value) as TAccount;
});

// TODO: remove mock data
const summary = computed(() => ({
    total_income: selectedAccountItem.value?.total_income || 0,
    total_expense: selectedAccountItem.value?.total_expense || 0,
}));
</script>
