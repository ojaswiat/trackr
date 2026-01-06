<template>
    <div class="flex flex-wrap items-start gap-8 w-fit mx-auto flex-none h-full">
        <AccountList
            class="flex-none h-[40%]"
            :accounts="accounts"
            @select-account="onAccountSelect"
        />

        <div class="flex flex-col gap-8">
            <CategoryExpenses :selected-account="selectedAccount" />
            <AccountSummary :accounts="accounts" />
        </div>

        <TransactionsRecent
            class="flex-none"
            :selected-account="selectedAccount"
        />
    </div>
</template>

<script setup lang="ts">
import { find } from "lodash-es";

const { data: response } = await useAsyncData("accounts", () => $fetch(ACCOUNTS_FETCH));
const accounts = computed<TAccount[]>(() => {
    return response.value?.data.accounts ?? [];
});

const selectedAccount = ref<TAccount>(accounts.value[0]!);

function onAccountSelect(accountId: string) {
    selectedAccount.value = find(accounts.value, (account) => account.id === accountId) ?? accounts.value[0]!;
}
</script>
