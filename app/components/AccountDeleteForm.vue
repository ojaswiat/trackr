<template>
    <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <div class="flex items-start gap-4">
                <UIcon
                    name="i-lucide:alert-triangle"
                    class="w-12 h-12 text-error"
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
                    class="w-fit"
                    variant="ghost"
                    color="neutral"
                    @click="open = false">
                    Cancel
                </UButton>
                <UButton
                    type="submit"
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
import z from "zod";

const props = defineProps({
    account: {
        type: Object as PropType<TAccount>,
        required: false,
    },
});

const toast = useToast();

const open = defineModel<boolean>("open");

const schema = z.object({
    keep_transactions: z.boolean().default(true),
});
type Schema = z.output<typeof schema>;

const initialState = {
    keep_transactions: true,
};

const state = ref(initialState);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: "Success", description: "Account deleted successfully!", color: "success" });
    console.info(props.account?.id, event.data);
    open.value = false;
}
</script>
