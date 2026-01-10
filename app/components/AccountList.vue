<template>
    <UCard
        :ui="{
            body: 'p-0 pb-20 sm:p-0 sm:pb-20 h-full overflow-y-scroll',
        }">
        <template #header>
            <div>
                <h5 class="text-xl text-primary font-bold">
                    All Accounts
                </h5>
                <p class="text-muted text-sm">
                    Click on an account to view its details. Scroll to view more
                </p>
            </div>
        </template>
        <div
            class="flex flex-col gap-4 items-center w-fit p-4">
            <AccountCard
                v-for="account in props.accounts"
                :key="`account-card-${account.id}`"
                :account="account"
                class="flex-shrink-0"
                @select-account="onAccountSelect"
            />
        </div>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
    accounts: {
        type: Object as PropType<TAccount[]>,
        required: true,
    },
});

const emits = defineEmits(["selectAccount"]);

function onAccountSelect(accountId: string) {
    emits("selectAccount", accountId);
}
</script>
