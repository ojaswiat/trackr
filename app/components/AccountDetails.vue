<template>
    <div class="flex flex-col gap-8">
        <div>
            <div class="w-full flex flex-wrap gap-8 items-center">
                <h5 class="text-2xl font-semibold">
                    {{ props.account?.name ?? 'Select an account' }}
                </h5>
                <AccountActions
                    v-if="!isEmpty(props.account) && props.account.id !== DEFAULT_ALL_ACCOUNT_ID"
                    @on-edit-account="emits('onEditAccount', props.account)"
                    @on-delete-account="emits('onDeleteAccount', props.account)"
                />
            </div>
            <p class="text-muted">
                {{ props.account?.description ?? 'Select an account to view its details and manage it' }}
            </p>
        </div>

        <DashboardSummary :summary="props.summary" />

        <AccountTransactions :account="props.account" />
    </div>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash-es";
import { DEFAULT_ALL_ACCOUNT_ID } from "~~/shared/constants/data.const";

const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: false,
    },
    summary: {
        type: Object as PropType<TAccountSummary>,
        required: true,
    },
});

const emits = defineEmits(["onEditAccount", "onDeleteAccount"]);
</script>
