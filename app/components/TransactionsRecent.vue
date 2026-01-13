<template>
    <div>
        <UCard class="dark:bg-neutral-800">
            <h5 class="text-xl font-bold">
                All Transactions
            </h5>
            <p class="text-muted text-sm">
                Showing transactions for {{ accountsMap[props.selectedAccount || "acc_000"]?.name }}
            </p>

            <div class="h-[calc(100vh-28rem)] overflow-y-scroll mt-4">
                <UTable
                    :columns="columns"
                    :column-visibility="columnVisibility"
                    :data="transactions"
                    :ui="{
                        root: 'px-0',
                    }"
                />
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { map, reduce } from "lodash-es";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

const props = defineProps({
    selectedAccount: {
        type: String,
        required: false,
    },
    selectedCategory: {
        type: String,
        required: false,
    },
    accounts: {
        type: Array as PropType<TAccount[]>,
        required: true,
    },
    categories: {
        type: Array as PropType<TCategory[]>,
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

const accountsMap = computed<Record<string, TAccount>>(() => {
    return reduce(
        props.accounts,
        (accumulator, account) => {
            accumulator[account.id] = account;
            return accumulator;
        },
        {} as Record<string, TAccount>,
    );
});

const { data: transactionsResponse } = await useAsyncData(
    () => `transactions-${props.selectedAccount}`, // Dynamic key for caching
    () => $fetch(TRANSACTIONS_FETCH, {
        method: "POST",
        body: {
            filters: {
                account_id: props.selectedAccount === "acc_000" ? [] : [props.selectedAccount],
            },
        },
    }),
    { watch: [() => props.selectedAccount] },
);

const transactions = computed(() => {
    const transactionsWithoutCategory = transactionsResponse.value?.data.transactions;
    const transactionWithCategory = map(transactionsWithoutCategory, (transaction) => {
        const transactionCategory = categoriesMap.value[transaction.category_id];
        const transactionAccount = accountsMap.value[transaction.account_id];

        return {
            ...transaction,
            category_name: transactionCategory?.name,
            category_color: transactionCategory?.color,
            account_name: transactionAccount?.name,
            account_color: transactionAccount?.color,
        };
    });

    return transactionWithCategory as TTransactionUI[];
});

const columns: TableColumn<TTransactionUI>[] = [
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => useDateTimeFormatter(row.getValue("created_at")).date,
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
                    class: `font-bold`,
                    style: {
                        color: categoryColor,
                    },
                },
                categoryName,
            );
        },
    },
    {
        accessorKey: "account_name",
        header: "Account",
        cell: ({ row }) => {
            const accountColor: string = row.getValue("account_color");
            const accountName: string = row.getValue("account_name");

            return h(
                "span",
                {
                    style: {
                        color: accountColor,
                    },
                },
                accountName,
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
    {
        accessorKey: "account_color",
    },
];

const columnVisibility = {
    type: false,
    category_color: false,
    account_color: false,
};
</script>
