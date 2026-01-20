<template>
    <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <UIcon
                    name="i-lucide:alert-triangle"
                    class="w-8 h-8 text-error flex-shrink-0"
                />
                <p>This will permanently delete the account <span class="text-error">{{ props.account?.name }}</span>{{ !state.keep_transactions ? " and all of its transactions" : "" }}. Are you sure you want to proceed?</p>
            </div>
            <UFormField
                label="Keep transactions"
                name="keep_transactions"
                class="flex items-center gap-2 flex-row-reverse justify-center">
                <UCheckbox
                    v-model="state.keep_transactions"
                    class="mb-[6px]"
                />
            </UFormField>

            <div class="w-full flex justify-end gap-4 mt-4">
                <UButton
                    type="button"
                    :disabled="deleting"
                    class="w-fit"
                    variant="ghost"
                    color="neutral"
                    @click="open = false">
                    Cancel
                </UButton>
                <UButton
                    type="submit"
                    :loading="deleting"
                    class="w-fit"
                    color="error">
                    Delete
                </UButton>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type z from "zod";
import { ACCOUNTS_REMOVE } from "~~/shared/constants/api.const";
import { ZDeleteAccountSchema } from "~~/shared/schemas/zod.schema";

const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: false,
    },
});

const emits = defineEmits(["update"]);

const toast = useToast();

const open = defineModel<boolean>("open");

const deleting = ref(false);

const schema = ZDeleteAccountSchema;
type Schema = z.output<typeof schema>;

const initialState = {
    keep_transactions: true,
};

const state = ref(initialState);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        if (!props.account?.id) {
            return;
        }

        deleting.value = true;

        await $fetch(`${ACCOUNTS_REMOVE}/${props.account.id}`, {
            method: "DELETE",
            body: event.data,
        });

        toast.add({ title: "Success", description: "Account deleted successfully!", color: "success" });
        open.value = false;
        emits("update");
    } catch (error: any) {
        const message = error.response?._data?.message || error.message || "Something went wrong! Please try again later.";
        toast.add({ title: "Error", description: message, color: "error" });
        console.error(error);
    } finally {
        deleting.value = false;
    }
}
</script>
