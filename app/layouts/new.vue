<template>
    <div class="w-screen">
        <UIPageHeader />
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `TrackR - ${titleChunk}` : "TrackR";
    },
});
</script>
