<template>
    <div class="flex flex-col gap-8">
        <div class="flex justify-end px-4">
            <UButton
                class="w-fit"
                icon="i-lucide:plus"
                @click="showAddAccountModal = true">
                Add Account
            </UButton>
        </div>

        <AccountsAccounts
            v-model:selected-account="selectedAccount"
            class="px-4"
            :accounts="accounts"
            @on-add-account="showAddAccountModal = true"
        />

        <AccountDetails
            class="px-4 mt-8"
            :account="selectedAccountItem"
            :summary="summary"
        />

        <UModal
            v-model:open="showAddAccountModal"
            :modal="true"
            :dismissible="false"
            title="New Account"
            :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full',
            }">
            <template #body>
                <AccountAddForm v-model:open="showAddAccountModal" />
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { find } from "lodash-es";

definePageMeta({
    title: "Accounts",
    description: "Manage your income sources",
    layout: "new",
});

useHead({
    title: "Accounts",
});

const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts?.slice(1) || [];
});

const selectedAccount = ref<string>("");
const showAddAccountModal = ref<boolean>(false);

const selectedAccountItem = computed(() => {
    return find(accounts.value, (account) => account.id === selectedAccount.value);
});
// TODO: remove mock data
const summary = computed(() => ({
    total_income: selectedAccountItem.value?.total_income || 0,
    total_expense: selectedAccountItem.value?.total_expense || 0,
}));
</script>
