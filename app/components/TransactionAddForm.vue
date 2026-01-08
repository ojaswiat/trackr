<template>
    <UCard>
        <template #header>
            <h3 class="text-xl font-bold text-primary">
                Add Transaction
            </h3>
        </template>

        <UForm
            :state="state"
            @submit="onSubmit">
            <div class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4 justify-between items-center">
                    <UFormField
                        label="Type"
                        name="type"
                        required>
                        <URadioGroup
                            :items="typeOptions"
                            orientation="horizontal"
                        />
                    </UFormField>

                    <UFormField
                        label="Date"
                        name="date"
                        required>
                        <UInput
                            type="date"
                            class="w-full"
                        />
                    </UFormField>
                </div>

                <UFormField
                    label="Account"
                    name="account"
                    required>
                    <USelect
                        class="w-full"
                        :items="accountOptions"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Select an account"
                    />
                </UFormField>

                <UFormField
                    label="Category"
                    name="category"
                    required>
                    <USelect
                        class="w-full"
                        :items="categoryOptions"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Select a category"
                    />
                </UFormField>

                <UFormField
                    label="Amount"
                    name="amount"
                    required>
                    <UInput
                        class="w-full"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                    />
                </UFormField>

                <UFormField
                    label="Note"
                    name="note">
                    <UTextarea
                        class="w-full"
                        :rows="3"
                        placeholder="Optional note about this transaction"
                        :maxlength="500"
                    />
                </UFormField>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    @click="handleReset">
                    Reset
                </UButton>
                <UButton
                    type="submit"
                    color="primary">
                    Add Transaction
                </UButton>
            </div>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";
import useAccountStore from "~/stores/AccountStore";
import useCategoryStore from "~/stores/CategoryStore";

const categoryStore = useCategoryStore();
const accountStore = useAccountStore();

const { categories } = storeToRefs(categoryStore);
const { accounts } = storeToRefs(accountStore);

const schema = z.object({
    date: z
        .string()
        .min(1, { message: "Date is required" })
        .refine((val) => {
            if (!val) {
                return false;
            }
            const date = new Date(val);
            return !Number.isNaN(date.getTime());
        }, { message: "Date must be a valid date" }),
    type: z
        .number()
        .refine((val) => val === 0 || val === 1, {
            message: "Type is required",
        }),
    category: z
        .string()
        .min(1, { message: "Category is required" }),
    account: z
        .string()
        .min(1, { message: "Account is required" }),
    amount: z
        .union([z.string(), z.number()])
        .transform((val) => {
            if (typeof val === "string") {
                const num = Number.parseFloat(val);
                return Number.isNaN(num) ? val : num;
            }
            return val;
        })
        .pipe(z.number({ message: "Amount must be a number" }).positive({ message: "Amount must be greater than 0" })),
    note: z
        .string()
        .max(500, { message: "Note must be at most 500 characters" })
        .optional()
        .or(z.literal("")),
});

const validationSchema = toTypedSchema(schema);

const { values, errors, handleSubmit, resetForm, meta } = useForm({
    validationSchema,
    validateOnMount: false,
    initialValues: {
        date: "",
        type: TRANSACTION_TYPE.EXPENSE,
        category: "",
        account: "",
        amount: "",
        note: "",
    },
});

const state = computed(() => ({
    values,
    errors,
    meta,
}));

const typeOptions = [
    { label: "Income", value: TRANSACTION_TYPE.INCOME },
    { label: "Expense", value: TRANSACTION_TYPE.EXPENSE },
];

const accountOptions = computed(() => {
    return accounts.value.map((account) => ({
        label: account.name,
        value: account.id,
    }));
});

const categoryOptions = computed(() => {
    const selectedType = values.type;
    return categories.value
        .filter((category: TCategory) => category.type === selectedType)
        .map((category: TCategory) => ({
            label: category.name,
            value: category.id,
        }));
});

const onSubmit = handleSubmit((formValues) => {
    // TODO: Handle form submission

    console.info("Form submitted:", formValues);
});

function handleReset() {
    resetForm();
}
</script>
