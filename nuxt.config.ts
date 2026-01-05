// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    css: ["~/assets/css/main.css"],

    devtools: {
        enabled: true,
    },

    modules: [
        "@nuxt/eslint",
        "@nuxt/ui",
    ],

    imports: {
        dirs: [
            "constants",
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

    ssr: false,
});
