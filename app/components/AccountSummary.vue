<template>
    <UCard>
        <h5 class="text-xl font-bold">
            Accounts Summary
        </h5>
        <p class="text-sm text-muted">
            A chart of income and expenses of all your accounts
        </p>

        <AccountSummaryChart
            class="mt-12"
            :accounts="props.accounts"
        />
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
});
</script>
