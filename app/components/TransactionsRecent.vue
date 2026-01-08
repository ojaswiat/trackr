<template>
    <UCard
        :ui="{
            body: 'p-0 sm:p-0',
        }">
        <template #header>
            <h5 class="text-xl text-primary font-bold">
                Recent Transactions
            </h5>
            <p class="text-muted text-sm">
                Showing transactions for {{ props.selectedAccount.name }}
            </p>
        </template>
        <div class="flex flex-col gap-4 items-center w-fit p-4">
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
import { map } from "lodash-es";
import useCategoryStore from "~/stores/CategoryStore";

const props = defineProps({
    selectedAccount: {
        type: Object as PropType<TAccount>,
        required: true,
    },
});

const categoryStore = useCategoryStore();
const { categoriesMap } = storeToRefs(categoryStore);

const { data: transactionsResponse, refresh: _refetch } = await useAsyncData(
    () => `transactions-${props.selectedAccount.id}`, // Dynamic key for caching
    () => $fetch(TRANSACTIONS_FETCH, {
        method: "POST",
        body: { account_id: props.selectedAccount.id },
    }),
    { watch: [props.selectedAccount] },
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
        cell: ({ row }) => formatDate(row.getValue("created_at")),
    },
    {
        accessorKey: "category_name",
        header: "Category",
        cell: ({ row }) => {
            const categoryColor: string = row.getValue("category_color");
            const categoryName: string = row.getValue("category_name");

            return h(
                resolveComponent("UBadge"),
                {
                    class: "capitalize",
                    variant: "subtle",
                    color: categoryColor,
                },
                () => categoryName,
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
            const amount = Number.parseFloat(row.getValue("amount"));
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "GBP",
            }).format(amount);
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

onMounted(async () => {
    await categoryStore.fetchCategories();
});
</script>
