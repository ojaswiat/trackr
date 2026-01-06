<template>
    <UCard
        :ui="{
            body: 'p-0 sm:p-0',
        }">
        <template #header>
            <h5 class="text-xl text-primary font-bold">
                Recent Transactions
            </h5>
            <p>
                {{ props.selectedAccount.name }}
            </p>
        </template>
        <div class="flex flex-col gap-4 items-center w-fit p-4">
            <TransactionCard
                v-for="transaction in transactions"
                :key="`transaction-list-${transaction.id}`"
                :transaction="transaction"
                class="flex-shrink-0"
            />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { map, reduce } from "lodash-es";

const props = defineProps({
    selectedAccount: {
        type: Object as PropType<TAccount>,
        required: true,
    },
});

const { data: categoriesRepsonse } = await useFetch(CATEGORIES_FETCH);

// const { data: categoriesRepsonse } = await useAsyncData(
//     () => "`categories-all",
//     () => $fetch(CATEGORIES_FETCH, {
//         method: "GET",
//     }),
// );

const { data: transactionsResponse, refresh: _refetch } = await useAsyncData(
    () => `transactions-${props.selectedAccount.id}`, // Dynamic key for caching
    () => $fetch(TRANSACTIONS_FETCH, {
        method: "POST",
        body: { account_id: props.selectedAccount.id },
    }),
    { watch: [props.selectedAccount] },
);

const categoriesMap = computed(() => {
    const categories = categoriesRepsonse.value?.data.categories ?? [];

    const catMap = reduce(categories, (accumulator, category) => {
        accumulator[category.id] = category as TCategory;
        return accumulator;
    }, {} as Record<string, TCategory>);

    return catMap;
});

const transactions = computed(() => {
    const transactionsWithoutCategory = transactionsResponse.value?.data.transactions;
    const transactionWithCategory = map(transactionsWithoutCategory, (transaction) => {
        const transactionCategory = categoriesMap.value[transaction.category_id];

        return {
            ...transaction,
            category_name: transactionCategory?.name,
            category_color: transactionCategory?.color,
        };
    });

    return transactionWithCategory as TTransactionUI[];
});
</script>
