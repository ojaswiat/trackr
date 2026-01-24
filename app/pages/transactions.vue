<template>
    <div class="w-full flex flex-col gap-8">
        <TransactionFilters
            v-model:selected-account="selectedAccount"
            v-model:selected-date-range="selectedDateRange"
            v-model:selected-type="selectedType"
            v-model:selected-category="selectedCategory"
            class="px-4"
            :accounts="accounts"
            :categories="categories"
            :loading="loading"
            @refresh="() => refreshTransactions()"
        />

        <TransactionsTable
            class="px-4"
            :selected-account-name="selectedAccountName"
            :selected-date-range="selectedDateRange"
            :transactions="transactions"
        />
    </div>
</template>

<script setup lang="ts">
import type { TTransactionType } from "~~/shared/constants/enums";
import { getLocalTimeZone, today } from "@internationalized/date";
import { find, map, reduce } from "lodash-es";
import { ACCOUNTS_FETCH, CATEGORIES_FETCH, TRANSACTIONS_FETCH } from "~~/shared/constants/api.const";

definePageMeta({
    title: "Transactions",
    description: "Manage your transactions here",
    layout: "app",
});

useHead({
    title: "Transactions",
});

const selectedAccount = ref<string>();
const selectedCategory = ref<string>();
const selectedType = ref<TTransactionType>();

const selectedDateRange = ref({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);
const { data: categoryResponse } = await useFetch(CATEGORIES_FETCH);

const { data: transactionsResponse, pending: loading, refresh: refreshTransactions } = await useAsyncData(
    () => `transactions-${selectedAccount.value}-${selectedCategory.value}-${selectedType.value}-${selectedDateRange.value.start}-${selectedDateRange.value.end}`,
    () => $fetch(TRANSACTIONS_FETCH, {
        method: "GET",
        query: {
            account_id: selectedAccount.value,
            category_id: selectedCategory.value,
            type: selectedType.value,
            startDate: selectedDateRange.value.start.toString(),
            endDate: selectedDateRange.value.end.toString(),
        },
    }),
    {
        watch: [selectedAccount, selectedCategory, selectedType, selectedDateRange],
    },
);

const categories = computed(() => {
    return categoryResponse.value?.data?.categories ?? [];
});

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts ?? [];
});

const categoriesMap = computed<Record<string, TCategory>>(() => {
    return reduce(
        categories.value,
        (accumulator, category) => {
            accumulator[category.id] = category;
            return accumulator;
        },
        {} as Record<string, TCategory>,
    );
});

const accountsMap = computed<Record<string, TAccount>>(() => {
    return reduce(
        accounts.value,
        (accumulator, account) => {
            accumulator[account.id] = account;
            return accumulator;
        },
        {} as Record<string, TAccount>,
    );
});

const selectedAccountName = computed(() => {
    const selectedAccountItem = find(accounts.value, (account) => account.id === selectedAccount.value);

    return selectedAccountItem?.name ?? "";
});

function mapTransactions(rawTransactions: TTransaction[]) {
    return map(rawTransactions, (transaction) => {
        const transactionCategory = categoriesMap.value[transaction.category_id];
        const transactionAccount = accountsMap.value[transaction.account_id];

        return {
            ...transaction,
            category_name: transactionCategory?.name,
            category_color: transactionCategory?.color,
            account_name: transactionAccount?.name,
            account_color: transactionAccount?.color,
        };
    }) as TTransactionUI[];
}

const transactions = computed (() => {
    return mapTransactions((transactionsResponse.value as TAPIResponseSuccess<{ transactions: TTransaction[] }>)?.data.transactions);
});

onMounted(async () => {
    await refreshTransactions();
});
</script>
