<template>
    <div class="flex flex-col gap-8 justify-center items-center px-4 h-full w-full">
        <div class="flex flex-col gap-4 items-center">
            <p class="text-2xl font-semibold">
                Check out a demo account
            </p>
            <UButton
                icon="i-lucide-circle-user"
                color="neutral"
                class="flex justify-center cursor-pointer"
                variant="outline"
                :loading="isDemoLoading"
                @click="signInDemoUser">
                Sign in as Demo User
            </UButton>
            <p class="text-muted text-xs">
                Demo account has read-only access
            </p>
        </div>

        <div class="flex flex-col gap-4 items-center">
            <p class="text-2xl font-semibold">
                or try the app yourself!
            </p>
            <UButton
                icon="i-simple-icons-github"
                color="neutral"
                class="flex justify-center cursor-pointer"
                variant="outline"
                :disabled="isDemoLoading"
                @click="signInWithGitHub">
                Sign in with GitHub
            </UButton>
            <UButton
                icon="i-simple-icons-google"
                color="neutral"
                class="flex justify-center cursor-pointer"
                variant="outline"
                :disabled="isDemoLoading"
                @click="signInWithGoogle">
                Sign in with Google
            </UButton>
            <p class="text-muted">
                The Google Sign In is only available for test users. Please use the GitHub Sign In instead.
            </p>
        </div>

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
const toast = useToast();

const isDemoLoading = ref(false);

async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
        options: {
            redirectTo: `${window.location.origin}${ROUTE_CONFIRM}`,
        },
        provider: "github",
    });

    if (error) {
        console.error("Error signing in:", error);
        toast.add({
            title: "Sign in failed",
            description: error.message,
            color: "error",
        });
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
        toast.add({
            title: "Sign in failed",
            description: error.message,
            color: "error",
        });
    }
}

async function signInDemoUser() {
    isDemoLoading.value = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: "demo@trackr.app",
            password: "asakgV-2ubsi-akjBva82",
        });

        if (error) {
            console.error("Error signing in as demo:", error);
            toast.add({
                title: "Demo sign in failed",
                description: "Unable to sign in to demo account. Please try again.",
                color: "error",
            });
            return;
        }

        if (data.user) {
            toast.add({
                title: "Welcome to Demo Mode!",
                description: "You are viewing a read-only demo account.",
                color: "success",
                icon: "i-lucide-info",
            });
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        toast.add({
            title: "Error",
            description: "An unexpected error occurred.",
            color: "error",
        });
    } finally {
        isDemoLoading.value = false;
    }
}

watch(user, async () => {
    if (user.value) {
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
