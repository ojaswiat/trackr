<template>
    <div class="w-full flex flex-wrap gap-4 p-4 justify-between items-center rounded-md hover:bg-neutral-400/10">
        <div class="flex gap-4 items-center">
            <div
                class="h-12 w-12 rounded-full flex items-center justify-center"
                :class="{
                    'bg-primary-100 dark:bg-primary-900/50 text-primary-500 dark:text-primary': props.transaction.type === TRANSACTION_TYPE.INCOME,
                    'bg-error-100 dark:bg-error-900/50 text-error-500 dark:text-error': props.transaction.type === TRANSACTION_TYPE.EXPENSE,
                }">
                <UIcon
                    :name="`${props.transaction.type === TRANSACTION_TYPE.INCOME ? 'i-lucide:trending-up' : 'i-lucide:trending-down'}`"
                    class="size-6"
                />
            </div>

            <div>
                <p class="font-semibold">
                    {{ props.transaction.description }}
                </p>
                <p class="text-muted font-sm">
                    {{ useDateTimeFormatter(props.transaction.transaction_date).date }}
                </p>
            </div>
        </div>
        <!-- <ClientOnly> -->
        <div>
            <p
                class="font-semibold"
                :class="{
                    'text-primary-500': props.transaction.type === TRANSACTION_TYPE.INCOME,
                    'text-error-500': props.transaction.type === TRANSACTION_TYPE.EXPENSE,
                }">
                {{ props.transaction.type === TRANSACTION_TYPE.INCOME ? "+" : "-" }}{{ useCurrencyFormatter(props.transaction.amount, currency?.symbol) }}
            </p>
        </div>
        <!-- </ClientOnly> -->
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";
import useUserStore from "~/stores/UserStore";

const props = defineProps({
    transaction: {
        type: Object as PropType<TTransaction>,
        required: true,
    },
});

const userStore = useUserStore();
const { currency } = storeToRefs(userStore);
</script>
