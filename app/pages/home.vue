<template>
    <div class="home px-4 h-full relative">
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

        <AccountSummary
            v-if="selectedAccount"
            :accounts="summaryAccounts"
        />

        <UButton
            class="absolute bottom-20 right-28 rounded-full p-4"
            size="xl"
            icon="i-lucide-file-plus-2"
            @click="showAddTransactionModal = true"
        />

        <UModal
            v-model:open="showAddTransactionModal"
            class="absolute"
            title="Add New Transaction"
            :dismissible="false"
            :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full',
            }">
            <template #body>
                <TransactionAddForm
                    :accounts="summaryAccounts"
                    :categories="categories"
                />
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { find } from "lodash-es";

const { data: accountsResponse, pending: pendingAccounts } = await useFetch(ACCOUNTS_FETCH);
const { data: categoriesResponse } = await useFetch(CATEGORIES_FETCH);

useHead({
    title: "Home",
});

const selectedAccount = ref<TAccount | null>(null);
const showAddTransactionModal = ref(false);

const accounts = computed<TAccount[]>(() => {
    return (accountsResponse.value?.data.accounts ?? []) as TAccount[];
});

const summaryAccounts = computed<TAccount[]>(() => {
    return accounts.value.slice(1);
});

const categories = computed<TCategory[]>(() => {
    return (categoriesResponse.value?.data.categories ?? []) as TCategory[];
});

function onAccountSelect(accountId: string) {
    const account = find(accounts.value, (account) => account.id === accountId);
    if (account) {
        selectedAccount.value = account;
    }
}

watch([accounts, pendingAccounts], () => {
    if (!pendingAccounts.value && accounts.value.length > 0 && !selectedAccount.value) {
        selectedAccount.value = accounts.value[0] ?? null;
    }
}, { immediate: true });
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
