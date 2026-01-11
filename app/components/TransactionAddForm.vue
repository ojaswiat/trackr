<template>
    <UForm
        :state="values"
        @submit.prevent="onSubmit">
        <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-4 justify-between items-center">
                <UFormField
                    class="flex flex-col gap-1"
                    label="Type"
                    name="type"
                    :error="errors.type"
                    required>
                    <URadioGroup
                        v-model="typeField"
                        :items="transactionTypeOptions"
                        orientation="horizontal"
                    />
                </UFormField>

                <UFormField
                    class="flex flex-col gap-1"
                    label="Date"
                    name="date"
                    :error="errors.date"
                    required>
                    <UInputDate
                        ref="inputDate"
                        v-model="dateProxy">
                        <template #trailing>
                            <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                                <UButton
                                    color="neutral"
                                    variant="link"
                                    size="sm"
                                    icon="i-lucide-calendar"
                                    aria-label="Select a date"
                                    class="px-0"
                                />

                                <template #content>
                                    <UCalendar
                                        v-model="dateProxy"
                                        class="p-2"
                                        :max-value="today(getLocalTimeZone())"
                                    />
                                </template>
                            </UPopover>
                        </template>
                    </UInputDate>
                </UFormField>
            </div>

            <UFormField
                class="flex flex-col gap-1"
                label="Account"
                name="account"
                :error="errors.account"
                required>
                <USelect
                    v-model="accountField"
                    class="w-full"
                    :items="accountOptions"
                    option-attribute="label"
                    value-attribute="value"
                    placeholder="Select an account">
                    <template #item-leading="{ item }">
                        <div
                            class="h-2 w-2 rounded-full mt-[6px] mr-2"
                            :style="{ backgroundColor: item.color }">
                        </div>
                    </template>
                </USelect>
            </UFormField>

            <UFormField
                class="flex flex-col gap-1"
                label="Category"
                name="category"
                :disabled="typeField === TRANSACTION_TYPE.INCOME"
                :error="errors.category"
                required>
                <USelect
                    v-model="categoryField"
                    class="w-full"
                    :items="categoryOptions"
                    option-attribute="label"
                    value-attribute="value"
                    :disabled="typeField === TRANSACTION_TYPE.INCOME"
                    placeholder="Select a category">
                    <template #item-leading="{ item }">
                        <div
                            class="h-2 w-2 rounded-full mt-[6px] mr-2"
                            :style="{ backgroundColor: item.color }">
                        </div>
                    </template>
                </USelect>
            </UFormField>

            <UFormField
                class="flex flex-col gap-1"
                label="Amount"
                name="amount"
                :error="errors.amount"
                required>
                <UInput
                    v-model="amountField"
                    class="w-full"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                />
            </UFormField>

            <UFormField
                class="flex flex-col gap-1"
                label="Note"
                name="note"
                :error="errors.note">
                <UTextarea
                    v-model="noteField"
                    class="w-full"
                    :rows="3"
                    placeholder="Optional note about this transaction"
                    :maxlength="500"
                />
            </UFormField>
        </div>

        <div class="flex justify-end gap-4 mt-4">
            <UButton
                type="button"
                color="neutral"
                variant="ghost"
                @click="resetForm()">
                Reset
            </UButton>
            <UButton
                type="submit"
                color="primary"
                variant="outline"
                icon="i-lucide:plus">
                Add
            </UButton>
            <UButton
                type="submit"
                color="primary"
                icon="i-lucide:file-check"
                @click="save = true">
                Save
            </UButton>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { toTypedSchema } from "@vee-validate/zod";
import { map } from "lodash-es";
import { useField, useForm } from "vee-validate";
import { z } from "zod";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

// TODO: Get this from stores
const { data: categoriesResponse } = await useFetch(CATEGORIES_FETCH);
const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const categories = computed(() => {
    return categoriesResponse.value?.data?.categories || [];
});

const accounts = computed(() => {
    return accountsResponse.value?.data?.accounts || [];
});

const schema = z.object({
    type: z
        .number()
        .refine((val) => val === 0 || val === 1, {
            message: "Type is required",
        }),
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
    category: z.string().optional(), // Make optional first
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
}).refine((data) => {
    // Category required ONLY for expense (type === 1)
    if (data.type === TRANSACTION_TYPE.EXPENSE && !data.category?.trim()) {
        return false;
    }
    return true;
}, {
    message: "Category is required for expenses",
    path: ["category"], // Error shows on category field
});

const save = ref(false);
const modalOpen = defineModel<boolean>("modalOpen", { default: false });

const inputDate = useTemplateRef("inputDate");
const validationSchema = toTypedSchema(schema);

const initialValues = {
    type: 1,
    date: "",
    category: "",
    account: "",
    amount: 0,
    note: "",
};

const { handleSubmit, values, errors, resetForm, isSubmitting: _isSubmitting } = useForm({
    validationSchema,
    initialValues,
});

const { value: typeField } = useField<0 | 1>("type");
const { value: dateField } = useField<string>("date");
const { value: categoryField } = useField<string>("category");
const { value: accountField } = useField<string>("account");
const { value: amountField } = useField<number>("amount");
const { value: noteField } = useField<string>("note");

const dateProxy = computed({
    get: () => {
        if (!dateField.value) {
            return undefined;
        }
        try {
            return parseDate(dateField.value);
        } catch {
            return undefined;
        }
    },
    set: (value: DateValue | undefined) => {
        if (!value) {
            dateField.value = "";
            return;
        }
        dateField.value = value.toString();
    },
});

const transactionTypeOptions = ref([
    { label: "Income", value: TRANSACTION_TYPE.INCOME },
    { label: "Expense", value: TRANSACTION_TYPE.EXPENSE },
]);

const accountOptions = computed(() => {
    return map(accounts.value, (account) => {
        return {
            label: account.name,
            value: account.id,
            color: account.color,
        };
    }).slice(1); // Remove the first option (All Accounts)
});

const categoryOptions = computed(() => {
    return map(categories.value, (category) => {
        return {
            label: category.name,
            value: category.id,
            color: category.color,
        };
    }).slice(1); // Remove the first option (Income Category)
});

function saveTransaction() {
    console.info(typeField.value);
    console.info(dateField.value);
    console.info(categoryField.value);
    console.info(accountField.value);
    console.info(amountField.value);
    console.info(noteField.value);
}

const onSubmit = handleSubmit(() => {
    saveTransaction();
    resetForm();

    if (!save.value) {
        modalOpen.value = false;
    }

    save.value = false;
});
</script>
