<template>
    <div class="px-4 space-y-8">
        <UCard class="shrink-0">
            <div class="w-full space-y-8">
                <h2 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
                    User Profile
                </h2>

                <UserProfileUpdateForm
                    :key="userKey"
                    :user="user"
                    :loading="loadingUser"
                />
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
                    :disabled="loading || !!user.is_demo"
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
                            class="w-8 h-8 text-error shrink-0"
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
import useUserStore from "~/stores/UserStore";

definePageMeta({
    title: "Profile",
    description: "Manage your profile settings",
    layout: "app",
});

useHead({
    title: "Profile",
});

const userStore = useUserStore();
const { user, userKey, updating, deleting, loading: loadingUser } = storeToRefs(userStore);

const loading = computed(() => {
    return updating.value || deleting.value || loadingUser.value;
});

const showDeleteUserModal = ref(false);

async function deleteUser() {
    await userStore.deleteUser();
}

onMounted(() => {
    userStore.fetchUser();
});
</script>
