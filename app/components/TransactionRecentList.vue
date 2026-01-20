<template>
    <UCard class="w-full dark:bg-neutral-800">
        <h5 class="text-xl font-bold">
            Recent Transactions
        </h5>
        <p class="text-sm text-muted mb-8">
            Your last 5 recorded transactions
        </p>

        <TransactionRecentItem
            v-for="transaction in transactions"
            :key="`transaction-recent-item-${transaction.id}`"
            :transaction="transaction"
        />
    </UCard>
</template>

<script setup lang="ts">
import { DEFAULT_ALL_ACCOUNT_ID } from "~~/shared/constants/data.const";

const props = defineProps({
    selectedAccount: {
        type: String,
        required: true,
    },
});

const { data: transactionsResponse } = await useAsyncData(
    () => `transactions-${props.selectedAccount}`, // Dynamic key for caching
    () => $fetch(TRANSACTIONS_FETCH, {
        method: "POST",
        body: {
            filters: {
                account_id: props.selectedAccount === DEFAULT_ALL_ACCOUNT_ID ? [] : [props.selectedAccount],
            },
        },
    }),
    { watch: [() => props.selectedAccount] },
);

const transactions = computed(() => {
    return (transactionsResponse.value?.data?.transactions?.slice(0, 5) || []) as TTransaction[];
});
</script>
