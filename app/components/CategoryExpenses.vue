<template>
    <UCard>
        <template #header>
            <div>
                <h5 class="text-xl font-bold text-primary w-xl">
                    {{ selectedAccount?.name }}
                </h5>
                <p
                    v-if="selectedAccount?.description"
                    class="text-wrap text-sm text-muted">
                    {{ selectedAccount.description }}
                </p>
            </div>
        </template>
        <CategoryExpensesChart :categories="categories" />
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    selectedAccount: {
        type: Object as PropType<TAccount>,
        required: true,
    },
});

const { data: response, refresh: _refetch } = await useAsyncData(
    () => `cat-exp-${props.selectedAccount.id}`, // Dynamic key for caching
    () => $fetch(CATEGORIES_EXPENSE_FETCH, {
        method: "POST",
        body: { account_id: props.selectedAccount.id },
    }),
    { watch: [props.selectedAccount] },
);

const categories = computed<TCategory[]>(() => {
    return response.value?.data.categories ?? [];
});
</script>
