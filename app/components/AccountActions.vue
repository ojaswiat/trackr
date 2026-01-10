<template>
    <div class="flex items-center gap-4">
        <UTooltip
            text="Edit this account"
            :delay-duration="0">
            <UButton
                variant="ghost"
                class="rounded-full"
                color="info"
                icon="i-lucide-pen-line"
                @click="emits('onEditAccount')"
            />
        </UTooltip>
        <UTooltip
            text="Delete this account"
            :delay-duration="0">
            <UButton
                color="error"
                variant="ghost"
                class="rounded-full"
                icon="i-lucide-trash-2"
                @click="emits('onDeleteAccount')"
            />
        </UTooltip>
    </div>
</template>

<script setup lang="ts">
const emits = defineEmits(["onEditAccount", "onDeleteAccount"]);
</script>
