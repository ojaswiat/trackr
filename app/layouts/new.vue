<template>
    <div class="w-screen flex">
        <UISideNav
            class="flex-shrink-0 w-64 pt-8 fixed top-0 left-0 z-9999"
            :open="true"
        />
        <div class="p-8 w-full bg-neutral-50 pb-16">
            <UIPageHeader class="px-4 mb-4" />
            <slot></slot>

            <UIAppFooter />
        </div>
    </div>
</template>

<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `trackr. - ${titleChunk}` : "trackr.";
    },
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
