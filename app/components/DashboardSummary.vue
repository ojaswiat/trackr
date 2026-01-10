<template>
    <div class="w-full flex flex-wrap items-center gap-8">
        <UCard class="w-60 bg-gradient-to-br from-primary-50 to-primary-400 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <p>
                        Total Income
                    </p>
                    <div class="h-8 w-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center">
                        <UIcon
                            name="i-lucide:trending-up"
                            class="size-4"
                        />
                    </div>
                </div>
                <p class="text-2xl font-bold">
                    {{ currency }} {{ props.summary.total_income }}
                </p>
            </div>
        </UCard>

        <UCard class="w-60 bg-gradient-to-br from-error-50 to-error-400 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <p>
                        Total Expense
                    </p>
                    <div class="h-8 w-8 rounded-full bg-error-100 text-error-500 flex items-center justify-center">
                        <UIcon
                            name="i-lucide:trending-down"
                            class="size-4"
                        />
                    </div>
                </div>
                <p class="text-2xl font-bold">
                    {{ currency }} {{ props.summary.total_expense }}
                </p>
            </div>
        </UCard>

        <UCard class="w-60 bg-gradient-to-br from-info-50 to-info-400 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <p>
                        Net Balance
                    </p>
                    <div class="h-8 w-8 rounded-full bg-info-100 text-info-500 flex items-center justify-center">
                        <UIcon
                            name="i-lucide:trending-up-down"
                            class="size-4"
                        />
                    </div>
                </div>
                <p class="text-2xl font-bold">
                    {{ currency }} {{ props.summary.total_income - props.summary.total_expense }}
                </p>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    summary: {
        type: Object as PropType<TAccountSummary>,
        required: true,
    },
});

// TODO: Fetch default currency from user store
const currency = computed(() => {
    // return useUserStore().user?.currency || "£";
    return "£";
});
</script>
