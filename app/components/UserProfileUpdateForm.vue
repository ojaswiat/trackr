<template>
    <UForm
        class="space-y-4 w-full"
        :schema="schema"
        :state="state"
        :disabled="loading"
        @submit="onSubmit">
        <UFormField
            class="w-full"
            label="First Name"
            name="first_name">
            <UInput
                v-model="state.first_name"
                class="w-full"
            />
        </UFormField>

        <UFormField
            class="w-full"
            label="Last Name"
            name="last_name">
            <UInput
                v-model="state.last_name"
                class="w-full"
            />
        </UFormField>

        <UFormField
            class="w-full"
            label="Email"
            name="email">
            <UInput
                v-model="state.email"
                class="w-full"
                disabled
                icon="i-heroicons-envelope"
            />
            <p class="text-xs text-gray-500 mt-1">
                Email cannot be changed.
            </p>
        </UFormField>

        <UFormField
            class="w-full"
            label="Currency"
            name="currency">
            <USelect
                v-model="state.currency"
                class="w-full"
                :items="CURRENCY_OPTIONS"
            />
        </UFormField>

        <div class="flex justify-end w-full mt-8">
            <UButton
                type="submit"
                :loading="loading"
                :disabled="isSame"
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
import { USER_FETCH, USER_UPDATE } from "~~/shared/constants/api.const";
import { ZUserProfileSchema } from "~~/shared/schemas/zod.schema";

const props = defineProps({
    user: {
        type: Object as PropType<TUserProfile>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});

definePageMeta({
    title: "Profile",
    description: "Manage your profile settings",
    layout: "app",
});

useHead({
    title: "Profile",
});

const toast = useToast();
const saving = ref(false);
const deleting = ref(false);

const CURRENCY_OPTIONS = reduce(currencies, (accumulator, currency, id) => {
    const item = {
        label: `${currency.flag} ${currency.id} (${currency.symbol}) - ${currency.country}`,
        value: id,
    };
    accumulator.push(item);
    return accumulator;
}, [] as {
    label: string;
    value: string;
}[]);

const schema = ZUserProfileSchema;
type Schema = z.output<typeof schema>;

const loading = computed(() => {
    return saving.value || deleting.value || props.loading;
});

const initialState = ref<TUserProfile>({
    id: props.user.id,
    first_name: props.user.first_name ?? "",
    last_name: props.user.last_name ?? "",
    email: props.user.email ?? "",
    currency: props.user.currency ?? undefined,
});

const state = reactive(cloneDeep(initialState));

const isSame = computed(() => {
    return (
        state.value.first_name === initialState.value.first_name
        && state.value.last_name === initialState.value.last_name
        && state.value.email === initialState.value.email
        && state.value.currency === initialState.value.currency
    );
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        saving.value = true;

        // Update profile
        const response = await $fetch(USER_UPDATE, {
            method: "PUT",
            body: event.data,
        });

        toast.add({ title: "Success", description: "Profile updated successfully!", color: "success" });

        state.value = cloneDeep(response as TAPIResponseSuccess<TUserProfile>).data;
        initialState.value = cloneDeep(state.value);
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
