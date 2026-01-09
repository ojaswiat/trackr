<template>
    <nav class="flex items-center gap-4 h-16 bg-primary p-4">
        <div class="w-10">
            <!-- placeholder for logo -->
        </div>

        <UButton
            v-if="isLoggedIn"
            class="ml-auto bg-transparent border-2 border-white text-white cursor-pointer"
            variant="outline"
            @click="logout">
            <span class="font-semibold">Sign Out</span>
        </UButton>
        <UButton
            v-else
            class="ml-auto bg-transparent border-2 border-white text-white cursor-pointer"
            variant="outline"
            @click="login">
            <span class="font-semibold">Sign In</span>
        </UButton>

        <UColorModeButton class="text-white cursor-pointer" />
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
