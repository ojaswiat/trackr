<template>
    <div class="flex flex-wrap gap-4 items-end">
        <p class="text-sm">
            Data between {{ df.format(selectedDateRange.start?.toDate(getLocalTimeZone())) }} - {{ df.format(selectedDateRange.end?.toDate(getLocalTimeZone())) }}
        </p>
        <UButton
            icon="lucide:refresh-ccw"
            size="sm"
            variant="outline"
            :loading="props.loading"
            @click="emits('refresh')">
            Refresh
        </UButton>
        <USelect
            v-model="selectedType"
            class="w-40 grow sm:ml-auto"
            :items="typeSelectOptions"
            placeholder="Select a type"
        />
        <USelect
            v-model="selectedCategory"
            class="w-40 grow"
            :items="categorySelectOptions"
            placeholder="Select a category"
            :disabled="selectedType === TRANSACTION_TYPE.INCOME">
            <template #item-leading="{ item }">
                <div
                    class="h-2 w-2 rounded-full mt-1.5 mr-2"
                    :style="{ backgroundColor: item.color }">
                </div>
            </template>
        </USelect>
        <USelect
            v-model="selectedAccount"
            class="w-40 grow"
            :items="accountSelectOptions"
            placeholder="Select an account">
            <template #item-leading="{ item }">
                <div
                    class="h-2 w-2 rounded-full mt-1.5 mr-2"
                    :style="{ backgroundColor: item.color }">
                </div>
            </template>
        </USelect>

        <UIDateFilter
            v-model:selected-date-range="selectedDateRange"
            :loading="props.loading"
        />
        <UButton
            icon="lucide:x"
            size="sm"
            variant="ghost"
            :loading="props.loading"
            @click="reset">
            Reset
        </UButton>
    </div>
</template>

<script setup lang="ts">
import type { TTransactionType } from "~~/shared/constants/enums";
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";
import { filter, map } from "lodash-es";
import { APP_CONFIG } from "~~/shared/constants/config.const";
import { CATEGORY_TYPE, TRANSACTION_TYPE } from "~~/shared/constants/enums";

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

const accountSelectOptions = computed(() => {
    const accountOptions = map(props.accounts, (account) => {
        return {
            label: account.name,
            value: account.id,
            color: account.color,
        };
    });

    return accountOptions;
});

const categorySelectOptions = computed(() => {
    const categoriesWithoutIncome = filter(props.categories, (category) => category.type !== CATEGORY_TYPE.INCOME);

    const categoryOptions = map(categoriesWithoutIncome, (category) => ({
        label: category.name,
        value: category.id,
        color: category.color,
    }));

    return categoryOptions;
});

const typeSelectOptions = ref([
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

function reset() {
    selectedAccount.value = undefined;
    selectedCategory.value = undefined;
    selectedType.value = undefined;
    selectedDateRange.value = {
        start: today(getLocalTimeZone()).subtract({ months: APP_CONFIG.DATE_RANGE_DEFAULT_MONTHS }),
        end: today(getLocalTimeZone()),
    };
}
</script>
