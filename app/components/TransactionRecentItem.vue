<template>
    <div class="w-full flex flex-wrap gap-4 justify-between items-center rounded-md p-4 hover:bg-muted">
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
                    {{ useDateTimeFormatter(props.transaction.created_at).date }}
                </p>
            </div>
        </div>
        <div>
            <p
                class="font-semibold"
                :class="{
                    'text-primary-500': props.transaction.type === TRANSACTION_TYPE.INCOME,
                    'text-error-500': props.transaction.type === TRANSACTION_TYPE.EXPENSE,
                }">
                {{ props.transaction.type === TRANSACTION_TYPE.INCOME ? "+" : "-" }}{{ currency }}{{ props.transaction.amount }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

const props = defineProps({
    transaction: {
        type: Object as PropType<TTransaction>,
        required: true,
    },
});

// TODO: Fetch default currency from user store
const currency = computed(() => {
    // return useUserStore().user?.currency || "£";
    return "£";
});
</script>
