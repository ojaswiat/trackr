<template>
    <UForm
        @submit="onSubmit">
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <UIcon
                    name="i-lucide:alert-triangle"
                    class="w-8 h-8 text-error"
                />
                <p>This will permanently delete the transaction <span class="text-error">{{ props.transaction?.amount }}</span></p>
            </div>

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
                    :disabled="!!user.is_demo"
                    class="w-fit"
                    color="error">
                    Delete
                </UButton>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import { TRANSACTIONS_DELETE } from "~~/shared/constants/api.const";
import useUserStore from "~/stores/UserStore";

const props = defineProps({
    transaction: {
        type: Object as PropType<TTransaction>,
        required: false,
    },
});

const toast = useToast();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const open = defineModel<boolean>("open");

const deleting = ref(false);

async function onSubmit() {
    try {
        deleting.value = true;

        await $fetch(`${TRANSACTIONS_DELETE}/${props.transaction?.id}`, {
            method: "DELETE",
        });

        toast.add({ title: "Success", description: "Transaction deleted successfully!", color: "success" });
        open.value = false;
    } catch (e) {
        const error = e as TAPIResponseError;
        const message = error.message || "Something went wrong! Please try again later.";
        toast.add({ title: "Error", description: message, color: "error" });
        console.error(error);
    } finally {
        deleting.value = false;
    }
}
</script>
