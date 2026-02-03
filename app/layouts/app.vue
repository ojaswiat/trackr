<template>
    <div class="w-screen">
        <UIDemoBanner
            v-if="!!user.is_demo"
            class="fixed top-0 w-full z-9999"
        />

        <div class="w-full flex">
            <UDrawer
                v-model:open="sidebar"
                direction="left">
                <template #content>
                    <UISideNav
                        class="shrink-0 w-64 pt-8"
                        :open="true"
                        @on-add-transaction="showAddTransactionModal = true"
                    />
                </template>
            </UDrawer>
            <div class="pt-8 px-4 min-w-0 grow bg-neutral-100 dark:bg-neutral-900 pb-16">
                <UIPageHeader
                    class="px-4 mb-4"
                    @toggle-sidebar="toggleSidebar"
                />
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
                    <TransactionAddForm v-model:open="showAddTransactionModal" />
                </template>
            </UModal>
        </div>
    </div>
</template>

<script setup lang="ts">
import useCategoryStore from "~/stores/CategoryStore";
import useUserStore from "~/stores/UserStore";

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `trackr. - ${titleChunk}` : "trackr.";
    },
});

const showAddTransactionModal = ref(false);

const userStore = useUserStore();
const categoryStore = useCategoryStore();
const { user } = storeToRefs(userStore);

const sidebar = ref(false);

function toggleSidebar() {
    sidebar.value = !sidebar.value;
}

onMounted(async () => {
    await userStore.fetchUser();
    await categoryStore.fetchCategories();
});
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
