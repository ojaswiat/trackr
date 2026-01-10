<template>
    <div class="w-full flex gap-8 py-6 items-center scrollbar-custom overflow-x-scroll">
        <AccountCard
            v-for="account in props.accounts"
            :key="`account-card-${account.id}`"
            v-model:selected-account="selectedAccount"
            :account="account"
        />
        <UCard
            as="button"
            class="w-60 h-[136px] flex-shrink-0 card-hover"
            :style="{
                background: `linear-gradient(to right, #00000000, #00000011)`,
            }"
            @click="emits('onAddAccount')">
            <div class="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                <UIcon
                    name="i-lucide:plus"
                    class="w-8 h-8"
                />
                <p class="text-2xl font-bold text-left">
                    Add Account
                </p>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    accounts: {
        type: Array as PropType<TAccount[]>,
        required: true,
    },
});

const emits = defineEmits(["onAddAccount"]);

const selectedAccount = defineModel<string>("selectedAccount");
</script>

<style scoped>
.card-hover {
    transform-origin: bottom center;
    transform: scale(1);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid;
}
.card-hover:hover {
    transform: scale(1.03);
}
</style>
