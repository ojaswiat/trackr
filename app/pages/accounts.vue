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
            @on-edit-account="onEditAccount"
            @on-delete-account="showDeleteAccountModal = true"
        />

        <UModal
            v-model:open="showAddAccountModal"
            :modal="true"
            :dismissible="false"
            :title="edit ? `${selectedAccountItem?.name}` : 'New Account'"
            :description="edit ? `Edit account ${selectedAccountItem?.name}` : 'Add a new account'"
            :close="{
                color: 'neutral',
                class: 'rounded-full',
            }">
            <template #body>
                <AccountAddForm
                    v-model:edit="edit"
                    v-model:open="showAddAccountModal"
                    :account="selectedAccountItem"
                    @update="() => refreshAccounts()"
                />
            </template>
        </UModal>

        <UModal
            v-model:open="showDeleteAccountModal"
            :modal="true"
            :dismissible="false"
            :title="`${selectedAccountItem?.name}`"
            :description="`Delete account ${selectedAccountItem?.name}`"
            :close="{
                color: 'neutral',
                class: 'rounded-full',
            }">
            <template #body>
                <AccountDeleteForm
                    v-model:open="showDeleteAccountModal"
                    :account="selectedAccountItem"
                />
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { find } from "lodash-es";
import { ACCOUNTS_FETCH } from "~~/shared/constants/api.const";
import { DEFAULT_ALL_ACCOUNT_ID } from "~~/shared/constants/data.const";

definePageMeta({
    title: "Accounts",
    description: "Manage your income sources",
    layout: "app",
});

useHead({
    title: "Accounts",
});

const { data: accountsAPIResponse, error: _accountsAPIError, refresh: refreshAccounts } = await useFetch(ACCOUNTS_FETCH);

const accounts = computed(() => {
    return (accountsAPIResponse.value as TAPIResponseSuccess<{ accounts: TAccount[] }>)?.data?.accounts || [];
});

const edit = ref(false);
const selectedAccount = ref<string>(DEFAULT_ALL_ACCOUNT_ID);

const showAddAccountModal = ref<boolean>(false);
const showDeleteAccountModal = ref<boolean>(false);

const selectedAccountItem = computed(() => {
    return find(accounts.value, (account) => account.id === selectedAccount.value);
});

const summary = computed(() => {
    const data = {
        total_income: 0,
        total_expense: 0,
    };

    data.total_income = (selectedAccountItem.value?.total_income ?? 0) + (selectedAccountItem.value?.initial_balance ?? 0);
    data.total_expense = selectedAccountItem.value?.total_expense || 0;

    return data;
});

function onEditAccount() {
    edit.value = true;
    showAddAccountModal.value = true;
}
</script>
