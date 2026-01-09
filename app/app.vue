<template>
    <UApp>
        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
    <Analytics />
</template>

<script setup>
import { Analytics } from "@vercel/analytics/nuxt";

useHead({
    meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [
        { rel: "icon", href: "/favicon.ico" },
    ],
    htmlAttrs: {
        lang: "en",
    },
});

const title = "TrackR";
const description = "Your app for tracking expenses and managing your finances";

useSeoMeta({
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
    twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
    twitterCard: "summary_large_image",
});
</script>
