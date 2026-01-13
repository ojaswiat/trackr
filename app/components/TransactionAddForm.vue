<template>
    <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-4 justify-between items-center">
                <UFormField
                    class="flex flex-col gap-1"
                    label="Type"
                    name="type"
                    required>
                    <URadioGroup
                        v-model="state.type"
                        :items="transactionTypeOptions"
                        orientation="horizontal"
                    />
                </UFormField>

                <UFormField
                    class="flex flex-col gap-1"
                    label="Date"
                    name="date"
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
                required>
                <USelect
                    v-model="state.account"
                    class="w-full"
                    :items="accountOptions"
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
                required>
                <USelect
                    v-model="state.category"
                    class="w-full"
                    :items="categoryOptions"
                    :disabled="state.type === TRANSACTION_TYPE.INCOME"
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
                required>
                <UInput
                    v-model="state.amount"
                    class="w-full"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                />
            </UFormField>

            <UFormField
                class="flex flex-col gap-1"
                label="Description"
                name="description"
                required>
                <UTextarea
                    v-model="state.description"
                    class="w-full"
                    :rows="2"
                    placeholder="Description about this transaction"
                    :maxlength="60"
                />

                <template #hint>
                    {{ state.description.length }}/60
                </template>
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
import type { FormSubmitEvent } from "@nuxt/ui";
import type { TTransactionType } from "~~/shared/constants/enums";
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { map } from "lodash-es";
import { z } from "zod";
import { TRANSACTION_TYPE } from "~~/shared/constants/enums";

// TODO: Get this from stores
const { data: categoriesResponse } = await useFetch(CATEGORIES_FETCH);
const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const toast = useToast();

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
    amount: z.number().min(0.01, { message: "Amount must be greater than 0.00" }),
    description: z
        .string()
        .min(1, { message: "Description is required" })
        .max(60, { message: "Description must be at most 60 characters" }),
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
type Schema = z.output<typeof schema>;

const save = ref(false);
const modalOpen = defineModel<boolean>("modalOpen", { default: false });

const inputDate = useTemplateRef("inputDate");

const initialState = {
    type: 1 as TTransactionType,
    date: today(getLocalTimeZone()).toString(),
    category: "",
    account: "",
    amount: 0.00,
    description: "",
};

const state = ref(initialState);

const dateProxy = computed({
    get: () => {
        if (!state.value.date) {
            return today(getLocalTimeZone());
        } else {
            const date = new Date(state.value.date);
            return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
        }
    },
    set: (value: CalendarDate | undefined) => {
        if (!value) {
            const thisDay = today(getLocalTimeZone());
            const thisDate = new Date(thisDay.toString());
            state.value.date = thisDate.toISOString();
            return;
        }

        const thisDate = new Date(value.toString());
        state.value.date = thisDate.toISOString();
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

function resetForm() {
    state.value.account = "";
    state.value.category = "";
    state.value.date = today(getLocalTimeZone()).toString();
    state.value.description = "";
    state.value.type = 1 as TTransactionType;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.info(event.data);
    toast.add({ title: "Success", description: "Transaction added successfully!", color: "success" });

    if (!save.value) {
        modalOpen.value = false;
    }

    save.value = false;
};
</script>
