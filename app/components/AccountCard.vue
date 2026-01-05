<template>
    <UCard
        as="button"
        class="flex flex-col border border-primary w-sm rounded-3xl"
        @click="emits('selectAccount', props.account.id)">
        <template #header>
            <h5 class="text-xl font-bold text-primary">
                {{ props.account.name }}
            </h5>
        </template>

        <template

            #default>
            <div class="flex justify-between items-center">
                <div class="flex justify-between items-center gap-2 text-primary font-semibold">
                    <Icon
                        name="i-lucide:square-arrow-down-right"
                        class="h-4 w-4"
                    />
                    <p>
                        {{ props.account.total_income }}
                    </p>
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
        </template>

        <template
            v-if="props.account.description"
            #footer>
            <p class="text-primary text-left">
                {{ props.account.description }}
            </p>
        </template>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    account: {
        type: Object as PropType<TAccountCard>,
        required: true,
    },
});

const emits = defineEmits(["selectAccount"]);
</script>
