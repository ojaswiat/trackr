<template>
    <div class="flex flex-wrap gap-4 items-end">
        <p>
            Data between {{ df.format(selectedDateRange.start?.toDate(getLocalTimeZone())) }} - {{ df.format(selectedDateRange.end?.toDate(getLocalTimeZone())) }}
        </p>
        <USelect
            v-model="selectedType"
            class="w-40 ml-auto"
            :items="typeSelectOptions"
            placeholder="Select a type"
        />
        <USelect
            v-model="selectedCategory"
            class="w-40"
            :items="categorySelectOptions"
            placeholder="Select a category"
            :disabled="selectedType === TRANSACTION_TYPE.INCOME">
            <template #item-leading="{ item }">
                <div
                    class="h-2 w-2 rounded-full mt-[6px] mr-2"
                    :style="{ backgroundColor: item.color }">
                </div>
            </template>
        </USelect>
        <USelect
            v-model="selectedAccount"
            class="w-xs"
            :items="accountSelectOptions"
            placeholder="Select an account">
            <template #item-leading="{ item }">
                <div
                    class="h-2 w-2 rounded-full mt-[6px] mr-2"
                    :style="{ backgroundColor: item.color }">
                </div>
            </template>
        </USelect>

        <UIDateFilter
            v-model:selected-date-range="selectedDateRange"
            :loading="props.loading"
        />

        <UButton
            icon="lucide:refresh-ccw"
            size="sm"
            variant="outline"
            :loading="props.loading"
            @click="emits('refresh')">
            Refresh
        </UButton>
    </div>
</template>

<script setup lang="ts">
import type { TTransactionType } from "~~/shared/constants/enums";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { map } from "lodash-es";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
    categories: {
        type: Object as PropType<TCategory[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});

const emits = defineEmits(["refresh"]);

const selectedType = defineModel<TTransactionType>("selectedType");
const selectedAccount = defineModel<string>("selectedAccount");
const selectedCategory = defineModel<string>("selectedCategory");
const selectedDateRange = defineModel<any>("selectedDateRange");

const accountSelectOptions = computed(() => map(props.accounts, (account) => ({
    label: account.name,
    value: account.id,
    color: account.color,
})));

const categorySelectOptions = computed(() => map(props.categories, (category) => ({
    label: category.name,
    value: category.id,
    color: category.color,
})));

const typeSelectOptions = ref([
    {
        label: "All",
        value: undefined,
        chip: {
            color: "info" as const,
        },
    },
    {
        label: "Expense",
        value: TRANSACTION_TYPE.EXPENSE,
        chip: {
            color: "error" as const,
        },
    },
    {
        label: "Income",
        value: TRANSACTION_TYPE.INCOME,
        chip: {
            color: "primary" as const,
        },
    },
]);

const df = new DateFormatter("en-GB", {
    dateStyle: "medium",
});
</script>
