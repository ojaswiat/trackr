<template>
    <UCard>
        <div>
            <h5 class="text-xl font-bold">
                Spending by Category
            </h5>
            <p
                class="text-wrap text-sm text-muted">
                Where your money went
            </p>
        </div>

        <CategoryExpensesChart
            class="mt-12"
            :categories="categories"
        />
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    selectedAccount: {
        type: String,
        required: true,
    },
});

const { data: categoryExpenseResponse, refresh: _refetch } = await useAsyncData(
    () => `cat-exp-${props.selectedAccount}`, // Dynamic key for caching
    () => $fetch(CATEGORIES_EXPENSE_FETCH, {
        method: "POST",
        body: {
            filters: {
                account_id: props.selectedAccount === "acc_000" ? [] : [props.selectedAccount],
            },
        },
    }),
    { watch: [() => props.selectedAccount] },
);

const categories = computed<TCategory[]>(() => {
    return categoryExpenseResponse.value?.data.categories ?? [];
});
</script>
