<template>
    <div class="w-screen flex">
        <UISideNav
            class="flex-shrink-0 w-64 pt-8 fixed top-0 left-0 z-9999"
            :open="true"
            @on-add-transaction="showAddTransactionModal = true"
        />
        <div class="pt-8 px-4 w-full bg-neutral-100 dark:bg-neutral-900 pb-16">
            <UIPageHeader class="px-4 mb-4" />
            <slot></slot>

            <UIAppFooter />
        </div>
        <UModal
            v-model:open="showAddTransactionModal"
            :modal="true"
            :dismissible="false"
            title="New Transaction"
            description="Add a new transaction"
            :close="{
                color: 'neutral',
                class: 'rounded-full',
            }">
            <template #body>
                <TransactionAddForm v-model:modal-open="showAddTransactionModal" />
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `trackr. - ${titleChunk}` : "trackr.";
    },
});

const showAddTransactionModal = ref(false);
</script>

<style>
.accounts-card-hover {
    transform-origin: bottom center;
    transform: scale(1);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.accounts-card-hover:hover {
    transform: scale(1.03);
}
</style>
