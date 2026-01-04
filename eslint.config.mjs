// @ts-check

import antfu from "@antfu/eslint-config";

// baseConfig: https://github.com/antfu/eslint-config
// Node Config: https://github.com/eslint-community/eslint-plugin-n
// JSON Config: https://github.com/ota-meshi/eslint-plugin-jsonc
export default antfu(
    {
        // https://eslint-plugin-perfectionist.azat.io/
        lessOpinionated: false,

        formatters: {
            /**
             * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
             * By default uses Prettier
             */
            css: true,

            /**
             * Format HTML files
             * By default uses Prettier
             */
            html: true,
            /**
             * Format Markdown files
             * Supports Prettier and dprint
             * By default uses Prettier
             */
            markdown: "prettier",
            graphql: "prettier",
        },

        // https://eslint.org/
        javascript: {
            overrides: {
                "prefer-const": [
                    "warn",
                    {
                        destructuring: "all",
                    },
                ],
            },

        },

        jsonc: true,

        // https://typescript-eslint.io/

        typescript: {
            overrides: {
                "ts/consistent-type-definitions": ["error", "type"],
                "no-undef": "off",
            },
        },

        vue: {
            overrides: {
                "vue/block-order": ["error", {
                    order: [["script", "template"], "style"],
                }],

                "vue/html-closing-bracket-newline": ["error", {
                    singleline: "never",
                    multiline: "never",
                    selfClosingTag: {
                        singleline: "never",
                        multiline: "always",
                    },
                }],

                "vue/html-self-closing": ["error", {
                    html: {
                        void: "never",
                        normal: "never",
                        component: "always",
                    },
                }],

                "vue/max-attributes-per-line": ["error", {
                    singleline: {
                        max: 1,
                    },
                    multiline: {
                        max: 1,
                    },
                }],
            },
        },

        stylistic: {
            indent: 4,
            quotes: "double",
            semi: true,
            overrides: {
                "style/arrow-parens": ["error", "always"],
                "style/brace-style": ["error", "1tbs"],
            },
        },

        yaml: {
            overrides: {
                "yml/indent": ["error", 4, {
                    indentBlockSequences: true,
                    indicatorValueIndent: 2,
                }],
            },
        },

        // https://unocss.dev/integrations/eslint
        unocss: false,
    },

    // Custom overrides
    {
        rules: {
            "curly": ["error", "all"],
            "no-console": ["error", { allow: ["warn", "error", "info"] }],
            "antfu/no-top-level-await": "off",
        },
    },

    // config with just ignores is the replacement for `.eslintignore`.
    // antfu config Reads from ".gitignore".
    // Add only those things here that are not in .gitignore
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/certs/**",
            "content/**",
            ".cursor/**",
        ],
    },
);
