<template>
    <div class="flex flex-wrap items-center justify-end gap-4 w-full">
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
                <template v-if="calendarRange.start">
                    <template v-if="calendarRange.end">
                        {{ df.format(calendarRange.start.toDate(getLocalTimeZone())) }} - {{ df.format(calendarRange.end.toDate(getLocalTimeZone())) }}
                    </template>

                    <template v-else>
                        {{ df.format(calendarRange.start.toDate(getLocalTimeZone())) }}
                    </template>
                </template>
                <template v-else>
                    Pick a date
                </template>
            </UButton>

            <template #content>
                <UCalendar
                    v-model="calendarRange"
                    class="p-2"
                    :number-of-months="2"
                    range
                />
            </template>
        </UPopover>
    </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";

const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
    minDate: {
        // TODO: Need this prop to set allowed range on the calendar
        type: Object as PropType<DateValue>,
        required: false,
    },
    maxDate: {
        // TODO: Need this prop to set allowed range on the calendar
        type: Object as PropType<DateValue>,
        required: false,
    },
});

const df = new DateFormatter("en-UK", {
    dateStyle: "medium",
});

const selectedAccount = defineModel<string>("selectedAccount");

// TODO: Emit events to catch this date range on change
const calendarRange = shallowRef({
    start: new CalendarDate(2026, 1, 20),
    end: new CalendarDate(2026, 2, 10),
});

const accountSelectOptions = computed(() => props.accounts.map((account) => ({
    label: account.name,
    value: account.id,
})));
</script>
