<template>
    <div class="home px-4 h-[80vh]">
        <AccountList
            class="accounts-list"
            :accounts="accounts"
            @select-account="onAccountSelect"
        />

        <CategoryExpenses
            v-if="selectedAccount"
            :selected-account="selectedAccount"
        />

        <TransactionsRecent
            v-if="selectedAccount"
            class="recent-transactions-list"
            :selected-account="selectedAccount"
            :categories="categories"
        />

        <!-- <TransactionAddForm
            :accounts="accounts"
            :categories="categories"
        /> -->

        <AccountSummary
            v-if="selectedAccount"
            :accounts="accounts"
        />
    </div>
</template>

<script setup lang="ts">
import { find } from "lodash-es";

const { data: accountsResponse, pending: pendingAccounts } = await useFetch(ACCOUNTS_FETCH);

const accounts = computed<TAccountList>(() => {
    return (accountsResponse.value?.data.accounts ?? []) as TAccountList;
});

const { data: categoriesResponse } = await useFetch(CATEGORIES_FETCH);

const categories = computed<TCategoryList>(() => {
    return (categoriesResponse.value?.data.categories ?? []) as TCategoryList;
});

const selectedAccount = ref<TAccount | null>(null);

watch([accounts, pendingAccounts], () => {
    if (!pendingAccounts.value && accounts.value.length > 0 && !selectedAccount.value) {
        selectedAccount.value = accounts.value[0] ?? null;
    }
}, { immediate: true });

function onAccountSelect(accountId: string) {
    const account = find(accounts.value, (account) => account.id === accountId);
    if (account) {
        selectedAccount.value = account;
    }
}
</script>

<style scoped>
.home {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 1rem;

    .accounts-list {
        grid-row-start: span 2;
    }

    .recent-transactions-list {
        grid-row-start: span 2;
    }
}
</style>
