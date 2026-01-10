<template>
    <div class="flex flex-col gap-2 justify-center items-center px-4 h-full">
        <div class="max-w-sm h-fit flex flex-col gap-4 items-center justify-center">
            <UButton
                size="xl"
                icon="i-simple-icons-github"
                color="neutral"
                class="w-full flex justify-center cursor-pointer"
                variant="outline"
                @click="signInWithGitHub">
                Sign in with GitHub
            </UButton>
            <UButton
                size="xl"
                icon="i-simple-icons-google"
                color="neutral"
                class="w-full flex justify-center cursor-pointer"
                variant="outline">
                Sign in with Google
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
        options: {
            redirectTo: `${window.location.origin}${ROUTE_CONFIRM}`,
        },
        provider: "github",
    });

    if (error) {
        console.error("Error signing in:", error);
    }
}

watch(user, () => {
    if (user.value) {
        // Redirect to /home instead of default '/'
        navigateTo(ROUTE_DASHBOARD);
    }
}, { immediate: true });

useHead({
    meta: [
        { content: "Sign in to trackr.", name: "description" },
    ],
    title: "Sign In",
});
</script>
