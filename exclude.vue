<script setup lang="ts">
import { toTyped } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

// Define Zod schema
const validationSchema = toTyped(
    z.object({
        firstName: z
            .string()
            .min(1, "First name is required")
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must not exceed 50 characters"),
        lastName: z
            .string()
            .min(1, "Last name is required")
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must not exceed 50 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain an uppercase letter")
            .regex(/[a-z]/, "Password must contain a lowercase letter")
            .regex(/\d/, "Password must contain a number"),
        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
        terms: z
            .boolean()
            .refine((val) => val, "You must agree to the terms"),
        newsletter: z
            .boolean()
            .default(false),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
);

// VeeValidate form setup
const { handleSubmit, values, errors, resetForm, isSubmitting } = useForm({
    validationSchema,
    initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
        newsletter: false,
    },
});

const toast = useToast();
const showPassword = ref(false);

// Handle submit with VeeValidate
const onSubmit = handleSubmit(async (formData) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.add({
            title: "Success",
            description: `Account created for ${formData.email}`,
            color: "green",
        });

        console.log("Form submitted:", {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            newsletter: formData.newsletter,
        });

        setTimeout(() => {
            resetForm();
        }, 2000);
    } catch (error) {
        toast.add({
            title: "Error",
            description: "An error occurred. Please try again.",
            color: "red",
        });
    }
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md mx-auto space-y-8">
            <!-- Header -->
            <div class="text-center">
                <h1 class="text-3xl font-bold text-slate-900 mb-2">
                    Create Account
                </h1>
                <p class="text-slate-600">
                    Zod + VeeValidate + Nuxt UI
                </p>
            </div>

            <!-- Form Card -->
            <UCard class="shadow-lg">
                <UForm
                    :state="values"
                    @submit="onSubmit">
                    <!-- First & Last Name Row -->
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField
                            label="First Name"
                            name="firstName"
                            :error="!!errors.firstName">
                            <UInput
                                v-model="values.firstName"
                                placeholder="John"
                                icon="i-heroicons-user"
                            />
                        </UFormField>

                        <UFormField
                            label="Last Name"
                            name="lastName"
                            :error="!!errors.lastName">
                            <UInput
                                v-model="values.lastName"
                                placeholder="Doe"
                                icon="i-heroicons-user"
                            />
                        </UFormField>
                    </div>

                    <!-- Email -->
                    <UFormField
                        label="Email Address"
                        name="email"
                        :error="!!errors.email">
                        <UInput
                            v-model="values.email"
                            type="email"
                            placeholder="john@example.com"
                            icon="i-heroicons-envelope"
                        />
                        <template #hint>
                            We'll never share your email
                        </template>
                    </UFormField>

                    <!-- Password -->
                    <UFormField
                        label="Password"
                        name="password"
                        :error="!!errors.password">
                        <UInput
                            v-model="values.password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••"
                            icon="i-heroicons-lock-closed"
                        />
                        <template #hint>
                            Min 8 chars: uppercase, lowercase, number
                        </template>
                    </UFormField>

                    <!-- Confirm Password -->
                    <UFormField
                        label="Confirm Password"
                        name="confirmPassword"
                        :error="!!errors.confirmPassword">
                        <UInput
                            v-model="values.confirmPassword"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••"
                            icon="i-heroicons-lock-closed"
                        />
                    </UFormField>

                    <!-- Show Password Toggle -->
                    <UCheckbox
                        v-model="showPassword"
                        name="showPassword"
                        label="Show password"
                    />

                    <!-- Terms -->
                    <UFormField
                        name="terms"
                        :error="!!errors.terms">
                        <template #label></template>
                        <UCheckbox
                            v-model="values.terms"
                            name="terms"
                            label="I agree to the Terms of Service and Privacy Policy"
                        />
                    </UFormField>

                    <!-- Newsletter -->
                    <UCheckbox
                        v-model="values.newsletter"
                        name="newsletter"
                        label="Send me updates about new features"
                    />

                    <!-- Actions -->
                    <div class="flex gap-3 pt-4">
                        <UButton
                            type="button"
                            variant="soft"
                            color="gray"
                            class="flex-1"
                            @click="resetForm">
                            Clear
                        </UButton>
                        <UButton
                            type="submit"
                            class="flex-1"
                            :loading="isSubmitting"
                            :disabled="isSubmitting">
                            Create Account
                        </UButton>
                    </div>
                </UForm>
            </UCard>
        </div>
    </div>
</template>
