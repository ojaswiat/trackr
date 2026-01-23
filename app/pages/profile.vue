<template>
    <div class="px-4 space-y-8">
        <UCard class="flex-shrink-0 min-w-sm">
            <div class="w-full space-y-8">
                <h2 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
                    User Profile
                </h2>

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
            </div>
        </UCard>

        <UCard :ui="{ root: 'ring-1 ring-red-200 dark:ring-red-900 bg-red-50 dark:bg-red-950/20' }">
            <template #header>
                <h2 class="text-lg font-semibold leading-6 text-red-700 dark:text-red-400">
                    Danger Zone
                </h2>
            </template>

            <div class="flex flex-col gap-4">
                <p class="text-sm text-red-600 dark:text-red-300">
                    Deleting your account is irreversible. All your data will be lost.
                </p>
                <UButton
                    color="error"
                    variant="soft"
                    :disabled="loading"
                    class="w-fit ml-auto"
                    @click="showDeleteUserModal = true">
                    Delete Account
                </UButton>
            </div>
        </UCard>

        <UModal
            v-model:open="showDeleteUserModal"
            :modal="true"
            :dismissible="false"
            title="Delete Profile"
            description="This will delete your user account"
            :close="{
                color: 'neutral',
                class: 'rounded-full',
            }">
            <template #body>
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                        <UIcon
                            name="i-lucide:alert-triangle"
                            class="w-8 h-8 text-error flex-shrink-0"
                        />
                        <p> Are you sure you want to delete your profile (user account)? This action cannot be undone.</p>
                    </div>

                    <div class="flex justify-end space-x-2">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            :disabled="loading"
                            @click="showDeleteUserModal = false">
                            Cancel
                        </UButton>
                        <UButton
                            color="error"
                            :loading="deleting"
                            @click="deleteUser">
                            Delete Permanently
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type z from "zod";
import type { TUserProfile } from "~~/shared/schemas/zod.schema";
import { cloneDeep, reduce } from "lodash-es";
import currencies from "~~/data/currencies.json";
import { USER_DELETE, USER_FETCH, USER_UPDATE } from "~~/shared/constants/api.const";
import { ZUserProfileSchema } from "~~/shared/schemas/zod.schema";

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

const { data: userResponse, pending: loadingUser } = await useFetch(USER_FETCH);

const user = computed(() => (userResponse.value as TAPIResponseSuccess<TUserProfile>).data);

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
    return saving.value || deleting.value || loadingUser.value;
});

const initialState = ref<TUserProfile>({
    id: user.value.id,
    first_name: user.value.first_name ?? "",
    last_name: user.value.last_name ?? "",
    email: user.value.email ?? "",
    currency: user.value.currency ?? undefined,
});

const state = reactive(cloneDeep(initialState));
const showDeleteUserModal = ref(false);

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

async function deleteUser() {
    try {
        deleting.value = true;

        await $fetch(USER_DELETE, {
            method: "DELETE",
        });

        toast.add({
            title: "Account Deleted",
            description: "Your account has been deleted successfully.",
            color: "success",
        });

        // Redirect to signin
        await navigateTo(ROUTE_SIGNIN);
    } catch (e) {
        const error = e as TAPIResponseError;
        const message = error.message || "Failed to delete account. Please try again.";
        toast.add({
            title: "Error",
            description: message,
            color: "error",
        });
        console.error(error);
    } finally {
        deleting.value = false;
    }
}
</script>
