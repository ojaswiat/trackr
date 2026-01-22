<template>
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
</template>

<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";

const df = new DateFormatter("en-GB", {
    dateStyle: "medium",
});

const selectedDateRange = defineModel<any>("selectedDateRange", {
    default: {
        start: today(getLocalTimeZone()).subtract({ months: 1 }),
        end: today(getLocalTimeZone()),
    },
});
const minDate = today(getLocalTimeZone()).subtract({ years: 1 });
const maxDate = today(getLocalTimeZone());
</script>
