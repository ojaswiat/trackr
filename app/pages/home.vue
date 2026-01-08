<template>
    <div class="flex flex-wrap items-start gap-8 w-fit mx-auto flex-none h-full px-4">
        <div class="flex flex-col gap-4 h-full">
            <AccountList
                class="flex-none h-[38%]"
                :accounts="accounts"
                @select-account="onAccountSelect"
            />
            <TransactionAddForm />
        </div>

        <div
            v-if="!isEmpty(selectedAccount)"
            :key="`${selectedAccount.id ?? 'no-account'}-summary`"
            class="flex flex-col gap-8">
            <CategoryExpenses :selected-account="selectedAccount" />
            <AccountSummary :accounts="accounts" />
        </div>

        <TransactionsRecent
            v-if="!isEmpty(selectedAccount)"
            :key="`${selectedAccount.id ?? 'no-account'}-transactions`"
            class="flex-none"
            :selected-account="selectedAccount"
        />
    </div>
</template>

<script setup lang="ts">
import { find, isEmpty } from "lodash-es";
import useAccountStore from "~/stores/AccountStore";

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const selectedAccount = ref<TAccount>(accounts.value[0]!);

function onAccountSelect(accountId: string) {
    selectedAccount.value = find(accounts.value, (account) => account.id === accountId) ?? accounts.value[0]!;
}

onMounted(async () => {
    await accountStore.fetchAccounts();
});
</script>
