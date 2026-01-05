<template>
    <div class="flex flex-wrap items-start gap-8">
        <AccountList
            :accounts="data"
            @select-account="onAccountSelect"
        />
        <AccountDetails :account="selectedAccount" />
    </div>
</template>

<script setup lang="ts">
import find from "lodash/find";

const { data } = await useAsyncData("accounts", () => $fetch(ACCOUNTS_FETCH));

const selectedAccount = ref<TAccountCard>(data.value![0]!);

function onAccountSelect(accountId: string) {
    selectedAccount.value = find(data.value, (account) => account.id === accountId) ?? data.value![0]!;
}
</script>
