<template>
    <UForm
        ref="form"
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
                    name="transaction_date"
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
                    v-model="state.account_id"
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
                    v-model="state.category_id"
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
                :disabled="saving"
                color="neutral"
                variant="ghost"
                @click="open = false">
                Cancel
            </UButton>
            <UButton
                v-if="!props.transaction?.id"
                type="submit"
                :loading="saving && !save"
                :disabled="(saving && save) || !!user.is_demo"
                color="primary"
                variant="outline"
                icon="i-lucide:plus">
                Add
            </UButton>
            <UButton
                type="submit"
                :loading="saving && save"
                :disabled="(saving && !save) || !!user.is_demo"
                color="primary"
                icon="i-lucide:file-check"
                @click="save = true">
                Save
            </UButton>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { z } from "zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { cloneDeep, filter, map } from "lodash-es";
import { ACCOUNTS_FETCH, CATEGORIES_FETCH, TRANSACTIONS_ADD, TRANSACTIONS_UPDATE } from "~~/shared/constants/api.const";
import { CATEGORY_TYPE, TRANSACTION_TYPE } from "~~/shared/constants/enums";
import { ZAddTransactionSchema } from "~~/shared/schemas/zod.schema";
import useUserStore from "~/stores/UserStore";

const props = defineProps({
    transaction: {
        type: Object as PropType<TTransaction>,
        required: false,
    },
});

// TODO: Get this from stores
const { data: categoriesResponse } = await useFetch(CATEGORIES_FETCH);
const { data: accountsResponse } = await useFetch(ACCOUNTS_FETCH);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const categories = computed(() => {
    return categoriesResponse.value?.data?.categories || [];
});

const accounts = computed(() => {
    return (accountsResponse.value as TAPIResponseSuccess<{ accounts: TAccount[] }>)?.data?.accounts || [];
});

const schema = ZAddTransactionSchema;
type Schema = z.output<typeof schema>;

const toast = useToast();
const form = useTemplateRef("form");

const save = ref(false);
const saving = ref(false);

const open = defineModel<boolean>("open", { default: false });

const inputDate = useTemplateRef("inputDate");

const initialState = {
    type: props.transaction?.type ?? 1,
    date: props.transaction?.created_at ?? today(getLocalTimeZone()).toString(),
    category_id: props.transaction?.category_id ?? "",
    account_id: props.transaction?.account_id ?? "",
    amount: props.transaction?.amount ?? 0.00,
    description: props.transaction?.description ?? "",
};

const state = reactive(cloneDeep(initialState));

const dateProxy = computed({
    get: () => {
        if (!state.date) {
            return today(getLocalTimeZone());
        } else {
            const date = new Date(state.date);
            return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
        }
    },
    set: (value: CalendarDate | undefined) => {
        if (!value) {
            const thisDay = today(getLocalTimeZone());
            const thisDate = new Date(thisDay.toString());
            state.date = thisDate.toISOString();
            return;
        }

        const thisDate = new Date(value.toString());
        state.date = thisDate.toISOString();
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
    const noIncomeCategory = filter(categories.value, (category) => category.type !== CATEGORY_TYPE.INCOME);

    const items = map(noIncomeCategory, (category) => {
        return {
            label: category.name,
            value: category.id,
            color: category.color,
        };
    });

    return items;
});

async function resetForm() {
    Object.assign(state, cloneDeep(initialState));
    form.value?.clear();
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        saving.value = true;

        const requestBody = {
            ...event.data,
            category_id: event.data.type === TRANSACTION_TYPE.INCOME
                ? undefined
                : event.data.category_id,
        };

        if (props.transaction?.id) {
            // Update transaction
            await $fetch(`${TRANSACTIONS_UPDATE}/${props.transaction.id}`, {
                method: "PUT",
                body: requestBody,
            });

            toast.add({ title: "Success", description: "Transaction updated successfully!", color: "success" });

            open.value = false;
        } else {
            // Add transaction
            await $fetch(TRANSACTIONS_ADD, {
                method: "POST",
                body: requestBody,
            });

            toast.add({ title: "Success", description: "Transaction added successfully!", color: "success" });

            // reset the value
            resetForm();

            if (!save.value) {
                open.value = false;
            }
        }

        save.value = false;
    } catch (e) {
        const error = e as TAPIResponseError;
        const message = error.message || "Something went wrong! Please try again later.";
        toast.add({ title: "Error", description: message, color: "error" });
        console.error(error);
    } finally {
        saving.value = false;
    }
};
</script>
