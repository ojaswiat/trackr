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
            class="px-4"
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
import { APP_CONFIG } from "~~/shared/constants/config.const";
import useTransactionActions from "~/composables/useTransactionActions";

definePageMeta({
    title: "Dashboard",
    description: "Welcome back! Here's your financial overview",
    layout: "app",
});

useHead({
    title: "Dashboard",
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const selectedAccount = ref<string>();

const selectedDateRange = ref({
    start: today(getLocalTimeZone()).subtract({ months: APP_CONFIG.DATE_RANGE_DEFAULT_MONTHS }),
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
            account_id: selectedAccount.value,
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

const { registerRefreshCallback, registerOptimisticCallbacks } = useTransactionActions();

/**
 * Check if transaction matches dashboard filters (date range and account)
 */
function transactionMatchesFilters(transaction: TTransaction): boolean {
    // Check account filter
    if (selectedAccount.value && transaction.account_id !== selectedAccount.value) {
        return false;
    }

    // Check date range filter
    const transactionDate = new Date(transaction.transaction_date || transaction.created_at);
    const startDate = new Date(selectedDateRange.value.start.toString());
    const endDate = new Date(selectedDateRange.value.end.toString());

    if (transactionDate < startDate || transactionDate > endDate) {
        return false;
    }

    return true;
}

onMounted(async () => {
    // Register this page's refresh function with the global transaction actions event bus
    registerRefreshCallback(refreshDashboardData);

    // Register optimistic update handlers
    registerOptimisticCallbacks({
        onAdd: (transaction) => {
            // Only add if it matches current filters
            if (transactionMatchesFilters(transaction)) {
                // Add to the beginning of recent transactions
                if (dashboardData.value?.data?.recentTransactions) {
                    dashboardData.value.data.recentTransactions.unshift(transaction);
                    // Keep only last 5
                    dashboardData.value.data.recentTransactions = dashboardData.value.data.recentTransactions.slice(0, 5);
                }

                // Update summary
                if (transaction.type === 0) {
                    // Income
                    if (dashboardData.value?.data?.monthlyOverview) {
                        dashboardData.value.data.monthlyOverview.income += transaction.amount;
                    }
                } else {
                    // Expense
                    if (dashboardData.value?.data?.monthlyOverview) {
                        dashboardData.value.data.monthlyOverview.expense += transaction.amount;
                    }
                }
            }
        },
        onUpdate: (transaction) => {
            if (dashboardData.value?.data?.recentTransactions) {
                const index = dashboardData.value.data.recentTransactions.findIndex((t) => t.id === transaction.id);
                if (index !== -1) {
                    if (transactionMatchesFilters(transaction)) {
                        dashboardData.value.data.recentTransactions[index] = transaction;
                    } else {
                        // Remove if it no longer matches filters
                        dashboardData.value.data.recentTransactions.splice(index, 1);
                    }
                } else if (transactionMatchesFilters(transaction)) {
                    // Add if it wasn't in the list but now matches filters
                    dashboardData.value.data.recentTransactions.unshift(transaction);
                    dashboardData.value.data.recentTransactions = dashboardData.value.data.recentTransactions.slice(0, 5);
                }
            }
        },
        onDelete: (transactionId) => {
            if (dashboardData.value?.data?.recentTransactions) {
                const index = dashboardData.value.data.recentTransactions.findIndex((t) => t.id === transactionId);
                if (index !== -1) {
                    const deletedTransaction = dashboardData.value.data.recentTransactions[index];
                    dashboardData.value.data.recentTransactions.splice(index, 1);

                    // Update summary
                    if (dashboardData.value?.data?.monthlyOverview) {
                        if (deletedTransaction?.type === 0) {
                            dashboardData.value.data.monthlyOverview.income -= (deletedTransaction?.amount ?? 0);
                        } else {
                            dashboardData.value.data.monthlyOverview.expense -= (deletedTransaction?.amount ?? 0);
                        }
                    }
                }
            }
        },
    });

    // Fetch initial dashboard data
    await refreshDashboardData();
});
</script>
