<template>
    <div class="w-full flex flex-wrap gap-8 items-center">
        <template v-if="!isEmpty(props.accounts)">
            <AccountCard
                v-for="account in props.accounts"
                :key="`account-card-${account.id}`"
                v-model:selected-account="selectedAccount"
                :account="account"
            />
        </template>
        <UCard
            v-if="props.accounts.length < APP_CONFIG.MAX_ACCOUNTS_PER_USER"
            as="button"
            class="accounts-card-hover add-card grow sm:grow-0 w-xs shrink-0 cursor-pointer"
            :ui="{
                root: 'border border-dashed border-muted hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/50',
            }"
            @click="emits('onAddAccount')">
            <div class="add-card-body flex flex-col gap-4 items-center text-muted">
                <div class="add-icon-bg flex items-center w-12 h-12 justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <UIcon
                        name="i-lucide:plus"
                        class="w-8 h-8"
                    />
                </div>
                <p class="text-lg font-semibold">
                    Add Account
                </p>
            </div>
        </UCard>
        <p
            v-else
            class="text-muted w-full">
            You can only add {{ APP_CONFIG.MAX_ACCOUNTS_PER_USER }} accounts at a time
        </p>
    </div>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash-es";
import { APP_CONFIG } from "~~/shared/constants/config.const";

const props = defineProps({
    accounts: {
        type: Array as PropType<TAccount[]>,
        required: true,
    },
});

const emits = defineEmits(["onAddAccount"]);

// TODO: default to all
const selectedAccount = defineModel<string>("selectedAccount");
</script>

<style scoped>
.add-card:hover {
    .add-card-body {
        color: var(--color-primary);
        .add-icon-bg {
            background-color: transparent;
        }
    }
}
</style>
