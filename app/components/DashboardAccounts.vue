<template>
    <div class="w-full flex gap-4 pb-6 pt-2 justify-between items-center scrollbar-custom overflow-x-scroll">
        <UCard
            v-for="account in accountSelectOptions"
            :key="`account-card-${account.value}`"
            class="w-60 flex-shrink-0 flex flex-col hover:scale-105 transition-transform duration-300 ease-in-out"
            :style="{ background: `linear-gradient(to right, ${account.color}00, ${account.color}11)` }"
            as="button"
            @click="handleAccountSelect(account.value)">
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between gap-2">
                    <UIcon
                        name="i-lucide:wallet"
                        class="size-6"
                        :style="{ color: account.color }"
                    />

                    <UIcon
                        v-if="account.value === selectedAccount"
                        name="i-lucide:circle-check"
                        class="size-6"
                        :style="{ color: account.color }"
                    />
                    <UIcon
                        v-else
                        name="i-lucide:circle"
                        class="size-6"
                        :style="{ color: account.color }"
                    />
                </div>

                <div class="text-sm text-gray-500 text-left">
                    {{ account.label }}
                </div>

                <div class="text-lg font-bold text-left">
                    {{ currency }} {{ account.balance }}
                </div>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    accounts: {
        type: Array as PropType<TAccount[]>,
        required: true,
    },
});

const selectedAccount = defineModel<string>("selectedAccount");

// TODO: Fetch default currency from user store
const currency = computed(() => {
    // return useUserStore().user?.currency || "£";
    return "£";
});

const accountSelectOptions = computed(() => props.accounts.map((account) => ({
    label: account.name,
    value: account.id,
    color: account.color,
    balance: (account.total_income ?? 0) - (account.total_expense ?? 0),
})));

function handleAccountSelect(accountId: string) {
    selectedAccount.value = accountId;
}
</script>
