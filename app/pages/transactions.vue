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
        <div
            ref="sentinel"
            class="h-10 w-full"></div>
    </div>
</template>

<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import type { TTransactionType } from "~~/shared/constants/enums";
import { getLocalTimeZone, today } from "@internationalized/date";
import { filter, find, map, reduce } from "lodash-es";
import { ACCOUNTS_FETCH, CATEGORIES_FETCH, TRANSACTIONS_FETCH } from "~~/shared/constants/api.const";
import { DEFAULT_ALL_ACCOUNT_ID } from "~~/shared/constants/data.const";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

definePageMeta({
    title: "Transactions",
    description: "Manage your transactions here",
    layout: "app",
});

useHead({
    title: "Transactions",
});

const selectedAccount = ref<string>(DEFAULT_ALL_ACCOUNT_ID);
const selectedCategory = ref<string>();
const selectedType = ref<TTransactionType>(TRANSACTION_TYPE.EXPENSE);

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
            account_id: selectedAccount.value === DEFAULT_ALL_ACCOUNT_ID ? undefined : selectedAccount.value,
            category_id: selectedCategory.value,
            type: selectedType.value,
            startDate: selectedDateRange.value.start.toString(),
            endDate: selectedDateRange.value.end.toString(),
            limit: 20,
        },
    }),
    {
        watch: [selectedAccount, selectedCategory, selectedType, selectedDateRange],
    },
);

const categories = computed(() => {
    const categoriesWithoutIncome = filter(
        categoryResponse.value?.data?.categories,
        (category) => category.id !== "cat_001",
    );
    return categoriesWithoutIncome as TCategory[];
});

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts || [];
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
    return find(accounts.value, (account) => account.id === (selectedAccount.value ?? DEFAULT_ALL_ACCOUNT_ID))?.name ?? "";
});

const transactions = ref<TTransactionUI[]>([]);
const cursor = ref<string | undefined>(undefined);
const hasMore = ref(true);
const sentinel = ref<HTMLElement | null>(null);

function mapTransactions(rawTransactions: any[]) {
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

watch(transactionsResponse, (newVal) => {
    if (newVal?.data) {
        transactions.value = mapTransactions(newVal.data.transactions);
        cursor.value = newVal.data.meta.next_cursor || undefined;
        hasMore.value = newVal.data.meta.has_more;
    }
}, { immediate: true });

async function loadMore() {
    if (!cursor.value || !hasMore.value || loading.value) {
        return;
    }

    try {
        const res = await $fetch(TRANSACTIONS_FETCH, {
            method: "GET",
            query: {
                account_id: selectedAccount.value === DEFAULT_ALL_ACCOUNT_ID ? undefined : selectedAccount.value,
                category_id: selectedCategory.value,
                type: selectedType.value,
                startDate: selectedDateRange.value.start.toString(),
                endDate: selectedDateRange.value.end.toString(),
                limit: 20,
                cursor: cursor.value,
            },
        });

        if (res.data) {
            const newTransactions = mapTransactions(res.data.transactions);
            transactions.value.push(...newTransactions);
            cursor.value = res.data.meta.next_cursor || undefined;
            hasMore.value = res.data.meta.has_more;
        }
    } catch (e) {
        console.error("Failed to load more transactions", e);
    }
}

let observer: IntersectionObserver | null = null;

onMounted(async () => {
    // Initial refresh is handled by useAsyncData immediate
    observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
            loadMore();
        }
    });
    if (sentinel.value) {
        observer.observe(sentinel.value);
    }
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>
