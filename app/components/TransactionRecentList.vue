<template>
    <UCard class="w-full dark:bg-neutral-800">
        <h5 class="text-xl font-bold">
            Recent Transactions
        </h5>
        <p class="text-sm text-muted mb-8">
            Your last 5 recorded transactions
        </p>

        <TransactionRecentItem
            v-for="transaction in props.transactions"
            :key="`transaction-recent-item-${transaction.id}`"
            :transaction="transaction"
        />
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    transactions: {
        type: Array as PropType<TTransaction[]>,
        required: true,
    },
});
</script>
