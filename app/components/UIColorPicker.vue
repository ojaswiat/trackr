<template>
    <UPopover
        :content="{
            side: 'bottom',
            align: 'start',
        }">
        <div
            class="w-10 h-10 rounded-full cursor-pointer border-2 border-neutral"
            :style="{ backgroundColor: selectedColor }"
            as="button">
        </div>

        <template #content>
            <div class="flex flex-wrap gap-4 p-4 w-64 aboslute top-0 left-0">
                <div
                    v-for="color in props.colors"
                    :key="color"
                    class="w-8 h-8 rounded-full cursor-pointer border-2 border-muted"
                    :style="{ backgroundColor: color }"
                    @click="selectedColor = color"></div>
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts">
const props = defineProps({
    colors: {
        type: Array as PropType<string[]>,
        required: true,
    },
});

const selectedColor = defineModel<string>("selectedColor", { default: "white" });
</script>
