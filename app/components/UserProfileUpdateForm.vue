<template>
    <UForm
        ref="form"
        class="space-y-4"
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <UFormField
            label="First Name"
            name="first_name">
            <UInput v-model="state.first_name" />
        </UFormField>

        <UFormField
            label="Last Name"
            name="last_name">
            <UInput v-model="state.last_name" />
        </UFormField>

        <UFormField
            label="Email"
            name="email">
            <UInput
                v-model="state.email"
                disabled
                icon="i-heroicons-envelope"
            />
            <p class="text-xs text-gray-500 mt-1">
                Email cannot be changed.
            </p>
        </UFormField>

        <UFormField
            label="Currency"
            name="currency">
            <USelect
                v-model="state.currency"
                :items="CURRENCY_OPTIONS"
            />
        </UFormField>

        <div class="flex justify-end">
            <UButton
                type="submit"
                :loading="saving"
                color="primary">
                Save Changes
            </UButton>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type z from "zod";
import type { TUserProfile } from "~~/shared/schemas/zod.schema";
import { cloneDeep, reduce } from "lodash-es";
import currencies from "~~/data/currencies.json";
import { USER_UPDATE } from "~~/shared/constants/api.const";
import { ZUserProfileSchema } from "~~/shared/schemas/zod.schema";

const props = defineProps({
    user: {
        type: Object as PropType<TUserProfile>,
        required: true,
    },
});

const emits = defineEmits(["update"]);

const saving = ref(false);

const CURRENCY_OPTIONS = reduce(currencies, (accumulator, currency) => {
    accumulator.push(currency);
    return accumulator;
}, [] as TCurrency[]);

const schema = ZUserProfileSchema;
type Schema = z.output<typeof schema>;

const toast = useToast();
const form = useTemplateRef("form");

const open = defineModel("open");

const initialState = {
    first_name: props.user.first_name ?? "",
    last_name: props.user.last_name ?? "",
    email: props.user.email ?? "",
    currency: props.user.currency ?? undefined,
};

const state = reactive(cloneDeep(initialState));

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        saving.value = true;

        // Update profile
        await $fetch(`${USER_UPDATE}}`, {
            method: "PUT",
            body: event.data,
        });

        toast.add({ title: "Success", description: "Transaction updated successfully!", color: "success" });

        open.value = false;
        emits("update");
    } catch (e) {
        const error = e as TAPIResponseError;
        const message = error.message || "Something went wrong! Please try again later.";
        toast.add({ title: "Error", description: message, color: "error" });
        console.error(error);
    } finally {
        saving.value = false;
    }
};
</script>
