<template>
    <BarChart
        :data="accountsData"
        class="chart-styles"
        :height="240"
        :categories="amountTypeMultiple"
        :y-axis="['income', 'expense']"
        x-axis="name"
        :group-padding="0"
        :bar-padding="0.2"
        :x-explicit-ticks="xExplicitTicks"
        :radius="4"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :legend-position="LegendPosition.BottomCenter"
        :hide-legend="false"
        :y-grid-line="true"
    />
</template>

<script setup lang="ts">
import { map } from "lodash-es";

const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
});

const accountsData = computed(() => {
    const data = map(props.accounts, (account) => {
        return {
            name: account.name,
            income: account.total_income,
            expense: account.total_expense,
        };
    });

    return data;
});

const amountTypeMultiple = {
    income: { name: "Income", color: "#22C55E" },
    expense: { name: "Expense", color: "#EF4444" },
};

const xExplicitTicks = computed(() => {
    return accountsData.value.map((_, index) => index);
});

function xFormatter(tick: number): string {
    const dataIndex = tick;
    const account = accountsData.value[dataIndex];
    return account?.name ?? "";
}
const yFormatter = (tick: number) => tick.toString();
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
