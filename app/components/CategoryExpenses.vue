<template>
    <UCard class="dark:bg-neutral-800">
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
            :categories="props.categories"
        />
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    categories: {
        type: Array as PropType<TCategory[]>,
        required: true,
    },
});
</script>
