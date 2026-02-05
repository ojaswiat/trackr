<template>
    <div class="flex flex-wrap items-end justify-between gap-4 w-full">
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
            v-model="selectedAccount"
            class="w-xs sm:ml-auto"
            :items="accountSelectOptions"
            :disabled="props.loading"
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
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";
import { map } from "lodash-es";
import { APP_CONFIG } from "~~/shared/constants/config.const";

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
        start: today(getLocalTimeZone()).subtract({ months: APP_CONFIG.DATE_RANGE_DEFAULT_MONTHS }),
        end: today(getLocalTimeZone()),
    },
});

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

const df = new DateFormatter("en-GB", {
    dateStyle: "medium",
});

function reset() {
    selectedAccount.value = undefined;
    selectedDateRange.value = {
        start: today(getLocalTimeZone()).subtract({ months: APP_CONFIG.DATE_RANGE_DEFAULT_MONTHS }),
        end: today(getLocalTimeZone()),
    };
}
</script>
