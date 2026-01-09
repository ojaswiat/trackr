// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    css: ["~/assets/css/main.css"],

    devtools: {
        enabled: true,
    },

    modules: [
        "@nuxt/eslint",
        "@nuxt/ui",
        "nuxt-charts",
        "@pinia/nuxt",
        "@nuxtjs/supabase",
    ],

    imports: {
        dirs: [
            "constants",
            "stores",
            "types",
        ],
    },

    compatibilityDate: "2025-01-15",

    eslint: {
        config: {
            stylistic: {
                commaDangle: "never",
                braceStyle: "1tbs",
            },
        },
    },

    supabase: {
        redirectOptions: {
            login: "/signin",
            callback: "/confirm",
            exclude: ["/", "/about"], // Add public pages here
        },
    },
});
