<template>
    <div class="flex flex-col gap-4 justify-center items-center px-4 h-full w-full">
        <UButton
            icon="i-simple-icons-github"
            color="neutral"
            class="flex justify-center cursor-pointer"
            variant="outline"
            @click="signInWithGitHub">
            Sign in with GitHub
        </UButton>
        <UButton
            icon="i-simple-icons-google"
            color="neutral"
            class="flex justify-center cursor-pointer"
            variant="outline"
            @click="signInWithGoogle">
            Sign in with Google
        </UButton>

        <p class="text-muted text-sm">
            By Signing in, you agree to our <NuxtLink
                class="underline"
                to="/terms">
                terms of service
            </NuxtLink> and <NuxtLink
                class="underline"
                to="/privacy">
                privacy policy
            </NuxtLink>
        </p>
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

async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        options: {
            redirectTo: `${window.location.origin}${ROUTE_CONFIRM}`,
        },
        provider: "google",
    });

    if (error) {
        console.error("Error signing in:", error);
    }
}

watch(user, async () => {
    if (user.value) {
        // Redirect to /home instead of default '/'
        await nextTick();
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
