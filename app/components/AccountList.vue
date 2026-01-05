<template>
    <div class="flex flex-col gap-4 items-center w-fit">
        <AccountCard
            v-for="account in props.accounts"
            :key="`account-card-${account.id}`"
            :account="account"
            @select-account="onAccountSelect"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    accounts: {
        type: Object as PropType<TAccountList>,
    },
});

const emits = defineEmits(["selectAccount"]);

function onAccountSelect(accountId: string) {
    emits("selectAccount", accountId);
}
</script>
