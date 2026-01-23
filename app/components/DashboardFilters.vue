<template>
    <div class="flex flex-wrap items-end justify-between gap-4 w-full">
        <p>
            Data between {{ df.format(selectedDateRange.start?.toDate(getLocalTimeZone())) }} - {{ df.format(selectedDateRange.end?.toDate(getLocalTimeZone())) }}
        </p>

        <div class="flex flex-wrap gap-4 items-center">
            <USelect
                v-model="selectedAccount"
                class="w-xs"
                :items="accountSelectOptions"
                :disabled="props.loading"
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
    </div>
</template>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";

const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});

const emits = defineEmits(["refresh"]);

const selectedAccount = defineModel<string>("selectedAccount");
const selectedDateRange = defineModel<any>("selectedDateRange", {
    default: {
        start: today(getLocalTimeZone()).subtract({ months: 1 }),
        end: today(getLocalTimeZone()),
    },
});

const accountSelectOptions = computed(() => props.accounts.map((account) => ({
    label: account.name,
    value: account.id,
    color: account.color,
})));

const df = new DateFormatter("en-GB", {
    dateStyle: "medium",
});
</script>
