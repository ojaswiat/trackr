<template>
    <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <UFormField
                label="Account name"
                name="name"
                required>
                <UInput
                    v-model="state.name"
                    class="w-full"
                />
                <template #hint>
                    {{ state.name.length }}/30
                </template>
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
                <template #hint>
                    {{ state.description.length }}/60
                </template>
            </UFormField>

            <UFormField
                label="Choose a color"
                name="color"
                required>
                <USelect
                    v-model="state.color"
                    class="w-full"
                    :items="colorOptions">
                    <template #item-leading="{ item }">
                        <div
                            class="h-4 w-4 rounded-full mt-0.5 mr-2"
                            :style="{ backgroundColor: item.value }">
                        </div>
                    </template>
                </USelect>
            </UFormField>

            <UFormField
                label="Initial balance"
                name="initial_balance"
                required>
                <UInput
                    v-model.number="state.initial_balance"
                    class="w-full"
                    :disabled="edit && !!props.account?.id"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                />
                <template #hint>
                    This will be counted towards income
                </template>
            </UFormField>

            <div class="flex justify-end gap-4 mt-4">
                <UButton
                    type="button"
                    :disabled="adding"
                    color-options
                    color="neutral"
                    variant="ghost"
                    @click="open = false">
                    Cancel
                </UButton>
                <UButton
                    type="submit"
                    :loading="adding"
                    :disabled="!!user.is_demo"
                    color="primary"
                    :icon="edit && props.account?.id ? 'i-lucide:refresh-ccw' : 'i-lucide:plus'">
                    {{ edit && props.account?.id ? 'Update' : 'Add' }}
                </UButton>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type z from "zod";
import { ACCOUNTS_ADD, ACCOUNTS_UPDATE } from "~~/shared/constants/api.const";
import { ZAddAccountSchema } from "~~/shared/schemas/zod.schema";
import useUserStore from "~/stores/UserStore";

const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: false,
    },
});

const emits = defineEmits(["update"]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const toast = useToast();

const open = defineModel<boolean>("open", { default: false });
const edit = defineModel<boolean>("edit", { default: false });

const adding = ref(false);

const colorOptions = [
    { label: "Red", value: "#FF6F61" }, // Coral Red
    { label: "Orange", value: "#FF8A50" }, // Coral Orange
    { label: "Golden", value: "#FFC857" }, // Golden Yellow
    { label: "Yellow", value: "#FFE66D" }, // Light Yellow
    { label: "Mint", value: "#95E1D3" }, // Mint Green
    { label: "Teal", value: "#38ADA9" }, // Teal Green
    { label: "Sky", value: "#ABC6FE" }, // Sky Blue
    { label: "Blue", value: "#1E90FF" }, // Dodger Blue
    { label: "Violet", value: "#6C5CE7" }, // Soft Purple
    { label: "Purple", value: "#A29BFE" }, // Light Purple
    { label: "Pink", value: "#FD79A8" }, // Pink
    { label: "Gold", value: "#FDCB6E" }, // Peachy Gold
];

const schema = ZAddAccountSchema;
type Schema = z.output<typeof ZAddAccountSchema>;

const initialState = {
    name: edit.value ? props.account?.name || "" : "",
    initial_balance: edit.value ? props.account?.initial_balance || 0 : 0,
    color: edit.value ? props.account?.color || "" : "",
    description: edit.value ? props.account?.description || "" : "",
};

const state = ref(initialState);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        adding.value = true;

        if (edit.value && props.account?.id) {
            // Update account
            await $fetch(`${ACCOUNTS_UPDATE}/${props.account.id}`, {
                method: "PUT",
                body: event.data,
            });
            toast.add({ title: "Success", description: "Account updated successfully!", color: "success" });
        } else {
            // Add account
            await $fetch(ACCOUNTS_ADD, {
                method: "POST",
                body: event.data,
            });

            toast.add({ title: "Success", description: "Account added successfully!", color: "success" });
        }

        edit.value = false;
        open.value = false;

        emits("update");
    } catch (error: any) {
        const message = error.response?._data?.message || error.message || "Something went wrong! Please try again later.";
        toast.add({ title: "Error", description: message, color: "error" });
        console.error(error);
    } finally {
        adding.value = false;
    }
}
</script>
