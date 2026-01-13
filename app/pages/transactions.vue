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
        />

        <TransactionsRecent
            class="px-4"
            :selected-account="selectedAccount"
            :selected-category="selectedCategory"
            :selected-date-range="selectedDateRange"
            :accounts="accounts"
            :categories="categories"
        />
    </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import type { TTransactionType } from "~~/shared/constants/enums";
import { getLocalTimeZone, today } from "@internationalized/date";
import { filter } from "lodash-es";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

definePageMeta({
    title: "Transactions",
    description: "Manage your transactions here",
    layout: "app",
});

useHead({
    title: "Transactions",
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);
const { data: categoryResponse } = await useFetch(CATEGORIES_FETCH);

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

const selectedAccount = ref<string>("acc_000");
const selectedCategory = ref<string>();
const selectedType = ref<TTransactionType>(TRANSACTION_TYPE.EXPENSE);

const selectedDateRange = ref<{ start: DateValue; end: DateValue }>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
});
</script>
