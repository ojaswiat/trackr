<template>
    <div class="px-4">
        <UAccordion
            :items="faqs"
            multiple
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: "Help",
    description: "Here you can find information on how to use trackr.",
    layout: "app",
});

useHead({
    title: "Help",
});

const faqs = [
    {
        label: "How do I add a new account?",
        content: "Navigate to the Accounts page and click the 'Add Account' button. Fill in the account name, initial balance, choose a color, and optionally add a description.",
    },
    {
        label: "How do I record a transaction?",
        content: "Click the 'New Transaction' button in the sidebar. Select the transaction type (Income or Expense), choose an account, select a category (for expenses), enter the amount and description, then click Save.",
    },
    {
        label: "Can I edit or delete transactions?",
        content: "Yes! Go to the Transactions page, find the transaction you want to modify, click the actions menu (⋮), and select Edit or Delete.",
    },
    {
        label: "How many accounts can I create?",
        content: "You can create up to 5 accounts. This limit helps keep your finances organized and manageable.",
    },
    {
        label: "How do I change my currency?",
        content: "Go to your Profile page and select your preferred currency from the dropdown menu. This will update how amounts are displayed throughout the app.",
    },
    {
        label: "What happens if I delete an account?",
        content: "When deleting an account, you'll be asked whether to keep the associated transactions. If you choose to keep them, the transactions will remain but won't be linked to any account.",
    },
    {
        label: "How do I filter transactions?",
        content: "On the Transactions page, use the filters at the top to select a specific account, category, transaction type, or date range.",
    },
    {
        label: "How is my data protected?",
        content: "Your data is secured with Supabase authentication and stored in an encrypted PostgreSQL database. We never share your financial information with third parties.",
    },
];
</script>
