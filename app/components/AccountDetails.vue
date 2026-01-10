<template>
    <div class="flex flex-col gap-8">
        <div>
            <div class="w-full flex flex-wrap gap-8 items-center">
                <h5 class="text-2xl font-semibold">
                    {{ props.account?.name ?? 'Select an account' }}
                </h5>
                <AccountActions v-if="!isEmpty(props.account)" />
            </div>
            <p class="text-muted">
                {{ props.account?.description ?? 'Select an account to view its details and manage it' }}
            </p>
        </div>

        <DashboardSummary :summary="props.summary" />

        <AccountTransactions />
    </div>
</template>

<script setup lang="ts">
import { isEmpty } from "@nuxt/ui/runtime/utils/index.js";

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
</script>
