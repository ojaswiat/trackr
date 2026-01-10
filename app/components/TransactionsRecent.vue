<template>
    <UCard
        :ui="{
            body: 'p-0 sm:p-0 h-full',
        }">
        <template #header>
            <h5 class="text-xl text-primary font-bold">
                Recent Transactions
            </h5>
            <p class="text-muted text-sm">
                Showing transactions for {{ props.selectedAccount.name }}
            </p>
        </template>

        <div class="h-full pb-20 overflow-y-scroll">
            <UTable
                :columns="columns"
                :column-visibility="columnVisibility"
                :data="transactions"
            />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { map, reduce } from "lodash-es";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

const props = defineProps({
    selectedAccount: {
        type: Object as PropType<TAccount>,
        required: true,
    },
    categories: {
        type: Object as PropType<TCategory[]>,
        required: true,
    },
});

const categoriesMap = computed<Record<string, TCategory>>(() => {
    return reduce(
        props.categories,
        (accumulator, category) => {
            accumulator[category.id] = category;
            return accumulator;
        },
        {} as Record<string, TCategory>,
    );
});

const { data: transactionsResponse, refresh: _refetch } = await useAsyncData(
    () => `transactions-${props.selectedAccount.id}`, // Dynamic key for caching
    () => $fetch(TRANSACTIONS_FETCH, {
        method: "POST",
        body: {
            filters: {
                account_id: props.selectedAccount.id === "acc_000" ? [] : [props.selectedAccount.id],
            },
        },
    }),
    { watch: [() => props.selectedAccount.id] },
);

const transactions = computed(() => {
    const transactionsWithoutCategory = transactionsResponse.value?.data.transactions;
    const transactionWithCategory = map(transactionsWithoutCategory, (transaction) => {
        const transactionCategory = categoriesMap.value[transaction.category_id];

        return {
            ...transaction,
            category_name: transactionCategory?.name,
            category_color: transactionCategory?.color,
        };
    });

    return transactionWithCategory as TTransactionUI[];
});

const columns: TableColumn<TTransactionUI>[] = [
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => formatDate(row.getValue("created_at")).date,
    },
    {
        accessorKey: "category_name",
        header: "Category",
        cell: ({ row }) => {
            const categoryColor: string = row.getValue("category_color");
            const categoryName: string = row.getValue("category_name");

            return h(
                "span",
                {
                    class: `capitalize border py-[2px] px-1 rounded-sm text-sm`,
                    style: {
                        borderColor: categoryColor,
                        color: categoryColor,
                    },
                },
                categoryName,
            );
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        meta: {
            class: {
                th: "text-right",
                td: "text-right font-medium",
            },
        },
        cell: ({ row }) => {
            const transactionType = row.getValue("type");
            const amount = Number.parseFloat(row.getValue("amount"));
            return h(
                "span",
                {
                    class: `font-semibold ${transactionType === TRANSACTION_TYPE.EXPENSE ? "text-red-500" : "text-primary"}`,
                },
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "GBP",
                }).format(amount),
            );
        },
    },

    // Hidden, just there to make the category cell work with the accessor keys
    {
        accessorKey: "type",
    },
    {
        accessorKey: "category_color",
    },
];

const columnVisibility = {
    type: false,
    category_color: false,
};
</script>
