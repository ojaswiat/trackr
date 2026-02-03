<template>
    <header class="w-full flex justify-start items-start gap-4">
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
                <h1 class="text-4xl font-bold">
                    {{ metaTitle || 'Dashboard' }}
                </h1>
                <UButton
                    icon="i-lucide:menu"
                    size="md"
                    variant="outline"
                    @click="toggleSidbar">
                    Menu
                </UButton>
            </div>

            <p class="text-muted">
                {{ metaDescription || "Welcome back! Here's your financial overview." }}
            </p>
        </div>

        <ClientOnly>
            <UColorModeButton class="w-fit cursor-pointer ml-auto" />
        </ClientOnly>
    </header>
</template>

<script setup lang="ts">
const emits = defineEmits(["toggleSidebar"]);

const route = useRoute();

const metaTitle = computed(() => route.meta.title as string);
const metaDescription = computed(() => route.meta.description as string);

function toggleSidbar() {
    emits("toggleSidebar");
}
</script>
