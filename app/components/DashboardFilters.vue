<template>
    <div class="flex flex-wrap items-end justify-between gap-4 w-full">
        <p class="text-sm font-semibold text-muted">
            Data between {{ df.format(selectedDateRange.start?.toDate(getLocalTimeZone())) }} - {{ df.format(selectedDateRange.end?.toDate(getLocalTimeZone())) }}
        </p>

        <div class="flex flex-wrap gap-4 items-center">
            <USelect
                v-model="selectedAccount"
                class="w-60"
                :items="accountSelectOptions"
                placeholder="Select an account"
            />

            <UPopover>
                <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-calendar">
                    <template v-if="selectedDateRange.start">
                        <template v-if="selectedDateRange.end">
                            {{ df.format(selectedDateRange.start.toDate(getLocalTimeZone())) }} - {{ df.format(selectedDateRange.end.toDate(getLocalTimeZone())) }}
                        </template>

                        <template v-else>
                            {{ df.format(selectedDateRange.start.toDate(getLocalTimeZone())) }}
                        </template>
                    </template>
                    <template v-else>
                        Pick a date
                    </template>
                </UButton>

                <template #content>
                    <UCalendar
                        v-model="selectedDateRange"
                        class="p-2"
                        :number-of-months="2"
                        :min-value="minDate"
                        :max-value="maxDate"
                        range
                    />
                </template>
            </UPopover>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";

const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
});

const df = new DateFormatter("en-UK", {
    dateStyle: "medium",
});

const selectedAccount = defineModel<string>("selectedAccount");
const selectedDateRange = defineModel<{ start: DateValue; end: DateValue }>("selectedDateRange", {
    default: {
        start: today(getLocalTimeZone()).subtract({ months: 1 }),
        end: today(getLocalTimeZone()),
    },
});

const minDate = today(getLocalTimeZone()).subtract({ years: 1 });
const maxDate = today(getLocalTimeZone());

const accountSelectOptions = computed(() => props.accounts.map((account) => ({
    label: account.name,
    value: account.id,
})));
</script>
