<template>
    <main class="flex flex-col gap-4 w-screen h-screen">
        <UITopNav />
        <main class="h-[84vh]">
            <slot></slot>
        </main>
        <UIAppFooter />
    </main>
</template>

<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `TrackR | ${titleChunk}` : "TrackR";
    },
});
</script>
