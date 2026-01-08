<template>
    <UCard
        as="button"
        class="w-sm"
        @click="emits('selectAccount', props.account.id)">
        <template #header>
            <p class="font-semibold text-primary text-left">
                {{ props.account.name }}
            </p>
        </template>

        <div class="flex justify-between items-center">
            <div class="flex justify-between items-center gap-2 text-primary font-semibold">
                <p>
                    {{ props.account.total_income }}
                </p>
                <Icon
                    name="i-lucide:square-arrow-down-right"
                    class="h-4 w-4"
                />
            </div>
            <div class="flex justify-between items-center gap-2 text-red-500 font-semibold">
                <p>
                    {{ props.account.total_expense }}
                </p>
                <Icon
                    name="i-lucide:square-arrow-up-right"
                    class="h-4 w-4"
                />
            </div>
        </div>

        <template
            v-if="props.account.description"
            #footer>
            <p class="text-left text-sm text-wrap">
                {{ props.account.description }}
            </p>
        </template>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: true,
    },
});

const emits = defineEmits(["selectAccount"]);
</script>
