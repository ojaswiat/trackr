<template>
    <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <UFormField
                label="Account name"
                name="name">
                <UInput
                    v-model="state.name"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                label="Description"
                name="description">
                <UTextarea
                    v-model="state.description"
                    class="w-full"
                    :rows="2"
                    placeholder="Optional description about this account"
                    :maxlength="60"
                />
            </UFormField>

            <UFormField
                label="Choose a color"
                name="color">
                <USelect
                    v-model="state.color"
                    class="w-full"
                    :items="colorOptions">
                    <template #item-leading="{ item }">
                        <div
                            class="h-4 w-4 rounded-full mt-[2px] mr-2"
                            :style="{ backgroundColor: item.value }">
                        </div>
                    </template>

                    <template #leading>
                        <div
                            class="h-4 w-4 rounded-full mr-2"
                            :style="{ backgroundColor: state.color }">
                        </div>
                    </template>
                </USelect>
            </UFormField>

            <UFormField
                label="Initial balance"
                name="initial_balance">
                <UInput
                    v-model="state.initial_balance"
                    class="w-full"
                    type="number"
                />
            </UFormField>

            <div class="flex justify-end gap-4 mt-4">
                <UButton
                    type="button"
                    color-options
                    color="neutral"
                    variant="ghost"
                    @click="resetForm()">
                    Reset
                </UButton>
                <UButton
                    type="submit"
                    color="primary"
                    icon="i-lucide:plus">
                    Add
                </UButton>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const toast = useToast();

const open = defineModel<boolean>("open");

// const colorOptions = [
//     { label: "Yellow", value: "#FFD93D" }, // Pastel Yellow
//     { label: "Orange", value: "#FFA94D" }, // Pastel Orange
//     { label: "Red", value: "#FF6B6B" }, // Pastel Red
//     { label: "Green", value: "#6BCB77" }, // Pastel Green
//     { label: "Teal", value: "#4D96FF" }, // Pastel Teal
//     { label: "Blue", value: "#A8D8FF" }, // Pastel Blue
//     { label: "Indigo", value: "#B197FC" }, // Pastel Indigo
//     { label: "Purple", value: "#DA70D6" }, // Pastel Purple
//     { label: "Pink", value: "#FF85C0" }, // Pastel Pink
//     { label: "Cyan", value: "#76E4F7" }, // Pastel Cyan
// ];

const colorOptions = [
    { label: "Red", value: "#FF6F61" }, // Coral Red
    { label: "Orange", value: "#FF8A50" }, // Coral Orange
    { label: "Golden", value: "#FFC857" }, // Golden Yellow
    { label: "Yellow", value: "#FFE66D" }, // Light Yellow
    { label: "Mint", value: "#95E1D3" }, // Mint Green
    { label: "Teal", value: "#38ADA9" }, // Teal Green
    { label: "Sky", value: "#2A9DF4" }, // Sky Blue
    { label: "Blue", value: "#1E90FF" }, // Dodger Blue
    { label: "Violet", value: "#6C5CE7" }, // Soft Purple
    { label: "Purple", value: "#A29BFE" }, // Light Purple
    { label: "Pink", value: "#FD79A8" }, // Pink
    { label: "Gold", value: "#FDCB6E" }, // Peachy Gold
];

const schema = z.object({
    name: z.string().min(1, "Account name is required"),
    initial_balance: z.number().min(0, "Initial balance must be positive"),
    color: z.string().min(1, "Please choose a color for this account"),
    description: z.string().max(60, "Description must be 60 characters or less").optional(),
});
type Schema = z.output<typeof schema>;

const initialState = {
    name: "",
    initial_balance: 0,
    color: "",
    description: "",
};

const state = ref(initialState);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: "Success", description: "Account added successfully!", color: "success" });
    console.info(event.data);
    open.value = false;
}

function resetForm() {
    state.value = initialState;
}
</script>
