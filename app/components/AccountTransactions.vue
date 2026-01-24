<template>
    <UCard class="dark:bg-neutral-800">
        <div class="min-h-80">
            <h5 class="text-xl font-bold">
                Account Transactions
            </h5>
            <p class="text-sm text-muted">
                Past 30 days
            </p>

            <AccountTransactionsChart
                v-if="props.account?.id"
                class="mt-12"
                :chart-data="chartData"
                :loading="loading"
            />
            <p
                v-else
                class="text-muted text-sm w-fit mx-auto mt-12">
                Select an account to view its transaction history
            </p>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { ACCOUNTS_HISTORY } from "~~/shared/constants/api.const";

const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: false,
    },
});

const chartData = ref<Array<{ date: string; income: number; expense: number }>>([]);
const loading = ref(false);
const error = ref(false);

async function fetchTransactionHistory() {
    if (!props.account?.id) {
        return;
    }

    try {
        loading.value = true;
        error.value = false;

        const response = await $fetch(`${ACCOUNTS_HISTORY}/${props.account.id}`, {
            method: "GET",
        });

        chartData.value = (response as TAPIResponseSuccess<{ history: Array<{ date: string; income: number; expense: number }> }>).data.history;
    } catch (e) {
        console.error("Failed to fetch transaction history:", e);
        error.value = true;
        chartData.value = [];
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await fetchTransactionHistory();
});

// Watch for account changes and fetch data
watch(() => props.account?.id, async (newAccountId) => {
    if (newAccountId) {
        await fetchTransactionHistory();
    }
}, { immediate: true });
</script>
