<template>
    <DonutChart
        :data="categoryExpenseChartData"
        class="chart-styles"
        :height="240"
        :categories="categoryExpenseCategories"
        :radius="80"
        :pad-angle="0.05"
        :arc-width="24">
        <p class="text-center font-semibold">
            Expenses
        </p>
    </DonutChart>
</template>

<script setup lang="ts">
import { map, reduce } from "lodash-es";

const props = defineProps({
    categories: {
        type: Object as PropType<TCategory[]>,
        required: true,
    },
});

const categoryExpenseChartData = computed(() => {
    const amounts = map(props.categories, (category) => Number(category.total_amount?.toFixed(2)) ?? 0.00);
    return amounts;
});

const categoryExpenseCategories = computed(() => {
    const catetgories = reduce(props.categories, (accumulator, category) => {
        accumulator[category.name] = {
            name: category.name,
            color: category.color,
        };
        return accumulator;
    }, {} as Record<string, { name: string; color: string }>);

    return catetgories;
});
</script>

<style scoped>
.chart-styles {
    --vis-legend-spacing: 1rem;
}
:deep(.css-czc1aa-bullet-legend-component) {
    flex-wrap: wrap;
    justify-content: center;
}
</style>
