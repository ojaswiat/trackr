<template>
    <div class="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary flex items-center justify-center mb-4">
            <UIcon
                :name="icon"
                class="w-6 h-6"
            />
        </div>
        <h3 class="text-xl font-semibold mb-2">
            {{ title }}
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400">
            {{ description }}
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string;
    title: string;
    description: string;
}>();
</script>
