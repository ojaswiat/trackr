<template>
    <div class="w-full flex gap-8 pb-6 pt-2 items-center scrollbar-custom overflow-x-scroll">
        <AccountCard
            v-for="account in props.accounts"
            :key="`account-card-${account.id}`"
            v-model:selected-account="selectedAccount"
            :account="account"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    accounts: {
        type: Array as PropType<TAccount[]>,
        required: true,
    },
});

const selectedAccount = defineModel<string>("selectedAccount");
</script>
