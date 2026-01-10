<template>
    <div class="w-screen flex">
        <UISideNav
            class="flex-shrink-0 w-64 pt-8 fixed top-0 left-0 z-9999"
            :open="true"
        />
        <div class="p-8 w-full bg-neutral-50">
            <UIPageHeader class="px-4 mb-4" />
            <slot></slot>
            <div class="px-4 mt-4">
                <UIAppFooter />
            </div>
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
