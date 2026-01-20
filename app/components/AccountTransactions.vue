<template>
    <UCard class="dark:bg-neutral-800">
        <h5 class="text-xl font-bold">
            Account Transactions
        </h5>
        <p class="text-sm text-muted">
            Past 30 days
        </p>

        <AccountTransactionsChart
            v-if="props.account?.id !== DEFAULT_ALL_ACCOUNT_ID"
            class="mt-12"
        />
        <p
            v-else
            class="text-muted text-sm w-fit h-fit mx-auto my-auto">
            Select an account to view its transaction history
        </p>
    </UCard>
</template>

<script setup lang="ts">
import { DEFAULT_ALL_ACCOUNT_ID } from "~~/shared/constants/data.const";

const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: false,
    },
});
</script>
