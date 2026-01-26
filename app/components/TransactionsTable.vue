<template>
    <div>
        <UCard class="dark:bg-neutral-800">
            <h5 class="text-xl font-bold">
                All Transactions
            </h5>
            <p class="text-muted text-sm">
                Showing transactions for {{ props.selectedAccountName }}
            </p>

            <div
                ref="table"
                class="h-[calc(100vh-26rem)] overflow-y-scroll mt-4">
                <UTable
                    :columns="columns"
                    :column-visibility="columnVisibility"
                    :data="props.transactions"
                    :loading="props.loading"
                    sticky
                    :ui="{
                        root: 'px-0 overflow-auto',
                    }"
                />
            </div>
        </UCard>

        <UModal
            v-if="selectedTransaction"
            v-model:open="showEditTransactionModal"
            :modal="true"
            :dismissible="false"
            title="Edit Transaction"
            :description="`Edit this transaction ${selectedTransaction.amount}`"
            :close="{
                color: 'neutral',
                class: 'rounded-full',
            }">
            <template #body>
                <TransactionAddForm
                    v-model:open="showEditTransactionModal"
                    :transaction="selectedTransaction"
                />
            </template>
        </UModal>

        <UModal
            v-model:open="showDeleteTransactionModal"
            :modal="true"
            :dismissible="false"
            title="Delete Transaction"
            :description="`Delete transaction of amount ${selectedTransaction?.amount}`"
            :close="{
                color: 'neutral',
                class: 'rounded-full',
            }">
            <template #body>
                <TransactionDeleteForm
                    v-model:open="showDeleteTransactionModal"
                    :transaction="selectedTransaction"
                />
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { useInfiniteScroll } from "@vueuse/core";
import { find } from "lodash-es";
import { APP_CONFIG } from "~~/shared/constants/config.const";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";
import useUserStore from "~/stores/UserStore";

const props = defineProps({
    selectedAccountName: {
        type: String,
        required: false,
    },
    transactions: {
        type: Array as PropType<TTransactionUI[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
    hasMoreData: {
        type: Boolean,
        required: true,
    },
});

const emits = defineEmits(["loadMore"]);

const userStore = useUserStore();
const { currency, user } = storeToRefs(userStore);

const table = useTemplateRef("table");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const showEditTransactionModal = ref(false);
const showDeleteTransactionModal = ref(false);
const selectedTransaction = ref<TTransaction>();

const columns: TableColumn<TTransactionUI>[] = [
    {
        accessorKey: "transaction_date",
        header: "Date",
        cell: ({ row }) => useDateTimeFormatter(row.getValue("transaction_date")).date,
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
                    currency: currency.value?.id ?? APP_CONFIG.DEFAULT_CURRENCY,
                }).format(amount),
            );
        },
    },

    // Row actions
    {
        id: "actions",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }) => {
            return h(
                UDropdownMenu,
                {
                    "content": {
                        align: "end",
                    },
                    "items": getRowItems(row),
                    "aria-label": "Actions dropdown",
                },
                () =>
                    h(UButton, {
                        "icon": "i-lucide-ellipsis-vertical",
                        "color": "neutral",
                        "variant": "ghost",
                        "aria-label": "Actions dropdown",
                    }),
            );
        },
    },

    // Hidden, just there to make the category cell work with the accessor keys
    {
        accessorKey: "id",
    },
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
    id: false,
    type: false,
    category_color: false,
    account_color: false,
};

function getRowItems(row: Row<TTransactionUI>) {
    return [
        {
            label: "Edit",
            icon: "i-lucide:pencil-line",
            color: "info",
            disabled: !!user.value.is_demo,
            onSelect() {
                onTransactionEdit(row.original.id);
            },
        },
        {
            label: "Delete",
            icon: "i-lucide:trash-2",
            color: "error",
            disabled: !!user.value.is_demo,
            onSelect() {
                onTransactionDelete(row.original.id);
            },
        },
    ];
}

function onTransactionEdit(id: string) {
    selectedTransaction.value = find(props.transactions, (transaction) => transaction.id === id);
    showEditTransactionModal.value = true;
}

function onTransactionDelete(id: string) {
    selectedTransaction.value = find(props.transactions, (transaction) => transaction.id === id);
    showDeleteTransactionModal.value = true;
}

onMounted(() => {
    useInfiniteScroll(
        table.value,
        () => {
            emits("loadMore");
        },
        {
            distance: 200,
            canLoadMore: () => {
                // Only load if not currently loading AND there's more data
                return !props.loading && props.hasMoreData;
            },
        },
    );
});
</script>
