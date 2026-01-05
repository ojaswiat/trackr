<template>
    <UCard class="border border-primary rounded-3xl text-center">
        <template #header>
            <h5 class="text-xl font-bold text-primary w-xl">
                {{ props.account.name }}
            </h5>
            <p v-if="props.account.description">
                {{ props.account.description }}
            </p>
        </template>
        <div>
            Provide category wise expenses here
        </div>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    account: {
        type: Object as PropType<TAccountCard>,
        required: true,
    },
});
</script>
