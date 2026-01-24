<template>
    <nav class="flex items-center gap-4 h-16 bg-slate-100 dark:bg-slate-800 p-4">
        <div class="w-10">
            <!-- placeholder for logo -->
        </div>

        <UButton
            v-if="isLoggedIn"
            class="ml-auto"
            @click="logout">
            <span class="font-semibold">Sign Out</span>
        </UButton>
        <UButton
            v-else
            class="ml-auto"
            @click="login">
            <span class="font-semibold">Sign In</span>
        </UButton>

        <ClientOnly>
            <UColorModeButton class="cursor-pointer" />
        </ClientOnly>
    </nav>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const user = useSupabaseUser();
const isLoggedIn = computed(() => !!user.value);

async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error);
    }
    navigateTo(ROUTE_SIGNIN);
}

function login() {
    navigateTo(ROUTE_SIGNIN);
}
</script>
