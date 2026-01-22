<template>
    <div class="space-y-6">
        <UCard>
            <template #header>
                <h2 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    Profile Settings
                </h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your personal information and currency preference.
                </p>
            </template>

            <form
                class="space-y-4"
                @submit.prevent="updateProfile">
                <UFormGroup
                    label="First Name"
                    name="first_name">
                    <UInput v-model="form.first_name" />
                </UFormGroup>

                <UFormGroup
                    label="Last Name"
                    name="last_name">
                    <UInput v-model="form.last_name" />
                </UFormGroup>

                <UFormGroup
                    label="Email"
                    name="email">
                    <UInput
                        v-model="form.email"
                        disabled
                        icon="i-heroicons-envelope"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        Email cannot be changed.
                    </p>
                </UFormGroup>

                <UFormGroup
                    label="Currency"
                    name="currency">
                    <USelect
                        v-model="form.currency"
                        :options="currencies"
                    />
                </UFormGroup>

                <div class="flex justify-end">
                    <UButton
                        type="submit"
                        :loading="pending"
                        color="primary">
                        Save Changes
                    </UButton>
                </div>
            </form>
        </UCard>

        <UCard :ui="{ root: 'ring-1 ring-red-200 dark:ring-red-900 bg-red-50 dark:bg-red-950/20' }">
            <template #header>
                <h2 class="text-lg font-semibold leading-6 text-red-700 dark:text-red-400">
                    Danger Zone
                </h2>
            </template>

            <div class="flex items-center justify-between">
                <p class="text-sm text-red-600 dark:text-red-300">
                    Deleting your account is irreversible. All your data will be lost.
                </p>
                <UButton
                    color="error"
                    variant="soft"
                    @click="isDeleteModalOpen = true">
                    Delete Account
                </UButton>
            </div>
        </UCard>

        <UModal v-model="isDeleteModalOpen">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Delete Account
                        </h3>
                        <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-heroicons-x-mark-20-solid"
                            class="-my-1"
                            @click="isDeleteModalOpen = false"
                        />
                    </div>
                </template>

                <div class="py-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                </div>

                <template #footer>
                    <div class="flex justify-end space-x-2">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            @click="isDeleteModalOpen = false">
                            Cancel
                        </UButton>
                        <UButton
                            color="error"
                            :loading="isDeleting"
                            @click="deleteAccount">
                            Delete Permanently
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { TUser } from "~~/shared/types/entity.types";

definePageMeta({
    title: "Profile",
    description: "Manage your profile settings",
    layout: "app",
});

useHead({
    title: "Profile",
});

const toast = useToast();
const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "INR", "CNY"];

const { data: user, refresh } = await useFetch<TUser>("/api/user/fetch");

const form = reactive({
    first_name: user.value?.first_name || "",
    last_name: user.value?.last_name || "",
    email: user.value?.email || "",
    currency: user.value?.currency || "USD",
});

const pending = ref(false);

async function updateProfile() {
    pending.value = true;
    try {
        await $fetch("/api/user/update", {
            method: "PUT",
            body: {
                first_name: form.first_name,
                last_name: form.last_name,
                currency: form.currency,
            },
        });
        toast.add({
            title: "Success",
            description: "Profile updated successfully.",
            color: "success",
        });
        await refresh();
    } catch (error: any) {
        toast.add({
            title: "Error",
            description: error.data?.message || "Failed to update profile.",
            color: "error",
        });
    } finally {
        pending.value = false;
    }
}

const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);

async function deleteAccount() {
    isDeleting.value = true;
    try {
        await $fetch("/api/user/delete", {
            method: "DELETE",
        });
        toast.add({
            title: "Account Deleted",
            description: "Your account has been deleted.",
            color: "success",
        });
        // Redirect to signin or home
        navigateTo("/signin");
    } catch (error: any) {
        toast.add({
            title: "Error",
            description: error.data?.message || "Failed to delete account.",
            color: "error",
        });
        isDeleting.value = false;
    }
}
</script>
