<!-- app/pages/privacy.vue -->
<template>
    <div class="max-w-4xl mx-auto px-4 py-12 prose dark:prose-invert">
        <h1 class="text-4xl font-bold">
            Privacy Policy
        </h1>

        <p class="text-sm text-muted">
            Last updated: January 2025
        </p>

        <br>
        <h2 class="text-2xl font-semibold">
            1. Information We Collect
        </h2>
        <ul>
            <li><strong>Account Information:</strong> Email address, name, and authentication credentials</li>
            <li><strong>Financial Data:</strong> Account balances, transactions, categories</li>
            <li><strong>Usage Data:</strong> How you interact with the application</li>
        </ul>

        <br>
        <h2 class="text-2xl font-semibold">
            2. How We Use Your Information
        </h2>
        <ul>
            <li>To provide and maintain the service</li>
            <li>To calculate financial summaries and insights</li>
            <li>To improve user experience</li>
        </ul>

        <br>
        <h2 class="text-2xl font-semibold">
            3. Data Storage
        </h2>
        <p>Your data is stored securely using Supabase infrastructure with encryption at rest and in transit.</p>

        <br>
        <h2 class="text-2xl font-semibold">
            4. Data Sharing
        </h2>
        <p>We do not sell, trade, or share your personal financial data with third parties.</p>

        <br>
        <h2 class="text-2xl font-semibold">
            5. Your Rights
        </h2>
        <ul>
            <li>Access your data at any time</li>
            <li>Delete your account and all associated data</li>
        </ul>

        <br>
        <h2 class="text-2xl font-semibold">
            6. Cookies
        </h2>
        <p>We only use essential cookies for authentication and session management.</p>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "Privacy Policy",
});
</script>
