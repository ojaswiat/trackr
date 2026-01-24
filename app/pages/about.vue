<template>
    <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold mb-8">
            About trackr.
        </h1>

        <div class="prose dark:prose-invert max-w-none">
            <p class="text-lg">
                trackr. is a modern personal finance tracking application designed to help you take control of your money.
            </p>

            <h2 class="text-2xl font-semibold mt-8 mb-4">
                Our Mission
            </h2>
            <p>
                We believe managing finances should be simple, intuitive, and accessible to everyone.
                trackr. provides you with the tools you need to track expenses, manage multiple accounts,
                and gain insights into your spending habits—all without the complexity of traditional finance software.
            </p>

            <h2 class="text-2xl font-semibold mt-8 mb-4">
                Features
            </h2>
            <ul>
                <li>Manage up to 5 separate accounts</li>
                <li>Track income and expenses with detailed categorization</li>
                <li>Visualize your financial data with interactive charts</li>
                <li>Filter and analyze transactions by date, account, and category</li>
                <li>Secure authentication with Supabase</li>
                <li>Multi-currency support</li>
            </ul>

            <h2 class="text-2xl font-semibold mt-8 mb-4">
                Technology
            </h2>
            <p>
                Built with modern web technologies including Nuxt 3, TypeScript, PostgreSQL, and Drizzle ORM,
                trackr. provides a fast, responsive, and reliable experience across all devices.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "About",
});
</script>
