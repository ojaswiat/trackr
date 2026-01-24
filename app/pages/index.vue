<template>
    <div class="min-h-screen flex flex-col">
        <!-- Hero Section -->
        <section class="flex-1 flex items-center justify-center px-4 py-20">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-6xl font-bold text-primary mb-6">
                    trackr.
                </h1>
                <p class="text-2xl text-neutral-600 dark:text-neutral-300 mb-8">
                    Your personal finance companion
                </p>
                <p class="text-lg text-neutral-500 dark:text-neutral-400 mb-12 max-w-2xl mx-auto">
                    Track expenses, manage accounts, and visualize your financial health—all in one simple, intuitive app.
                </p>

                <div class="flex gap-4 justify-center">
                    <UButton
                        size="xl"
                        icon="i-lucide:rocket"
                        @click="navigateTo(ROUTE_SIGNIN)">
                        Get Started
                    </UButton>
                    <UButton
                        size="xl"
                        variant="outline"
                        icon="i-lucide:info"
                        @click="navigateTo(ROUTE_ABOUT)">
                        Learn More
                    </UButton>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-neutral-100 dark:bg-neutral-900">
            <div class="max-w-6xl mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-16">
                    Everything you need to manage your money
                </h2>

                <div class="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon="i-lucide:wallet"
                        title="Multiple Accounts"
                        description="Manage up to 5 accounts with custom colors and track balances separately"
                    />
                    <FeatureCard
                        icon="i-lucide:trending-up"
                        title="Income & Expense Tracking"
                        description="Record every transaction with detailed categorization and descriptions"
                    />
                    <FeatureCard
                        icon="i-lucide:pie-chart"
                        title="Visual Insights"
                        description="Beautiful charts and graphs to understand your spending patterns"
                    />
                    <FeatureCard
                        icon="i-lucide:calendar"
                        title="Date Range Filters"
                        description="Analyze your finances over any time period with flexible date filters"
                    />
                    <FeatureCard
                        icon="i-lucide:shield-check"
                        title="Secure & Private"
                        description="Your data is encrypted and protected with enterprise-grade security"
                    />
                    <FeatureCard
                        icon="i-lucide:smartphone"
                        title="Works Everywhere"
                        description="Access your finances from any device, anywhere, anytime"
                    />
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20">
            <div class="max-w-4xl mx-auto text-center px-4">
                <h2 class="text-4xl font-bold mb-6">
                    Ready to take control of your finances?
                </h2>
                <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
                    Join trackr. today and start making smarter financial decisions.
                </p>
                <UButton
                    size="xl"
                    icon="i-lucide:arrow-right"
                    @click="navigateTo(ROUTE_SIGNIN)">
                    Start Tracking Now
                </UButton>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "trackr. - Your Personal Finance Tracker",
});
</script>
