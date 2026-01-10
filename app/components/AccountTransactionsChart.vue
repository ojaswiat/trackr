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
// TODO: Replace mock data
const chartData = [
    {
        date: "Jan 23",
        income: 2890,
        expense: 2338,
    },
    {
        date: "Feb 23",
        income: 2756,
        expense: 2103,
    },
    {
        date: "Mar 23",
        income: 3322,
        expense: 2194,
    },
    {
        date: "Apr 23",
        income: 3470,
        expense: 2108,
    },
    {
        date: "May 23",
        income: 3475,
        expense: 1812,
    },
    {
        date: "Jun 23",
        income: 3129,
        expense: 1726,
    },
    {
        date: "Jul 23",
        income: 3490,
        expense: 1982,
    },
    {
        date: "Aug 23",
        income: 2903,
        expense: 2012,
    },
    {
        date: "Sep 23",
        income: 2643,
        expense: 2342,
    },
    {
        date: "Oct 23",
        income: 2837,
        expense: 2473,
    },
    {
        date: "Nov 23",
        income: 2954,
        expense: 3848,
    },
    {
        date: "Dec 23",
        income: 3239,
        expense: 3736,
    },
];

const categories: Record<string, BulletLegendItemInterface> = {
    income: { name: "Income", color: "#10b981" },
    expense: { name: "Expense", color: "#ef4444" },
};

function xFormatter(tick: number, _i?: number, _ticks?: number[]): string {
    return String(chartData[tick]?.date ?? "");
}
</script>
