<template>
    <div class="flex items-center gap-4">
        <UTooltip
            text="Edit this account"
            :delay-duration="0">
            <UButton
                variant="ghost"
                class="rounded-full"
                color="info"
                icon="i-lucide-pencil-line"
                :disabled="!!user.is_demo"
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
                :disabled="!!user.is_demo"
                @click="emits('onDeleteAccount')"
            />
        </UTooltip>
    </div>
</template>

<script setup lang="ts">
import useUserStore from "~/stores/UserStore";

const emits = defineEmits(["onEditAccount", "onDeleteAccount"]);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>
