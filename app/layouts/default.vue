<template>
    <main class="flex flex-col gap-4 w-screen h-screen">
        <UITopNav />
        <main class="h-[84vh]">
            <slot></slot>
        </main>
        <UIAppFooter class="fixed bottom-0 w-full" />
    </main>
</template>

<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `trackr. | ${titleChunk}` : "trackr.";
    },
});
</script>
