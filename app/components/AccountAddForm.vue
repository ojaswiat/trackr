<template>
    <UForm
        :schema="schema"
        :state="state"
        :ui="{
            base: 'w-full flex flex-col gap-4',
        }"
        @submit="onSubmit">
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
            label="Initial balance"
            name="initial_balance">
            <UInput
                v-model="state.initial_balance"
                class="w-full"
                type="number"
            />
        </UFormField>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const toast = useToast();

const schema = z.object({
    name: z.string().min(1, "Account name is required"),
    initial_balance: z.number().min(0, "Initial balance must be positive"),
    color: z.string().min(1, "Please choose a color for this account"),
    description: z.string().max(60, "Description must be 60 characters or less").optional(),
});
type Schema = z.output<typeof schema>;

const state = reactive({
    name: "",
    initial_balance: 0,
    color: "",
    description: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.info(event.data);
}
</script>
