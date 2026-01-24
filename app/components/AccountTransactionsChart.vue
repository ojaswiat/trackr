<template>
    <LineChart
        :data="chartData"
        :height="280"
        y-label="Sales"
        :x-num-ticks="4"
        :y-num-ticks="4"
        :categories="categories"
        :x-formatter="xFormatter"
        :y-grid-line="true"
        :curve-type="CurveType.Linear"
        :legend-position="LegendPosition.TopRight"
        :hide-legend="false"
    />
</template>

<script lang="ts" setup>
const props = defineProps({
    chartData: {
        type: Object as PropType<TAccountTransactionChartData[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});

const categories: Record<string, BulletLegendItemInterface> = {
    income: { name: "Income", color: "#10b981" },
    expense: { name: "Expense", color: "#ef4444" },
};

function xFormatter(tick: number, _i?: number, _ticks?: number[]): string {
    return String(props.chartData[tick]?.date ?? "");
}
</script>
