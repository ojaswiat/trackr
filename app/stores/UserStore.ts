import type { TUserProfile } from "~~/shared/schemas/zod.schema";
import { cloneDeep, find, reduce } from "lodash-es";
import { acceptHMRUpdate, defineStore } from "pinia";
import currencies from "~~/data/currencies.json";
import { USER_DELETE, USER_FETCH, USER_UPDATE } from "~~/shared/constants/api.const";

const useUserStore = defineStore("UserStore", () => {
    const CURRENCY_OPTIONS = reduce(currencies, (accumulator, currency, id) => {
        const item = {
            label: `${currency.flag} ${currency.id} (${currency.symbol}) - ${currency.country}`,
            value: id,
        };
        accumulator.push(item);
        return accumulator;
    }, [] as {
        label: string;
        value: string;
    }[]);

    const toast = useToast();

    const user = ref<TUserProfile>({} as TUserProfile);

    const loading = ref<boolean>(false);
    const updating = ref<boolean>(false);
    const deleting = ref<boolean>(false);

    const currency = computed(() => {
        return find(
            currencies,
            (currency, id) => id === user.value?.currency || currency.id === (user.value?.currency ?? "GBP"),
        );
    });

    const userKey = computed(() => getObjectKey(user.value));

    async function fetchUser() {
        try {
            loading.value = true;
            const userResponse = await $fetch(USER_FETCH);
            user.value = userResponse.data;
        } catch (e) {
            const error = e as TAPIResponseError;
            const message = error.message || "Failed to delete account. Please try again.";

            toast.add({
                title: "Error",
                description: message,
                color: "error",
            });
        } finally {
            loading.value = false;
        }
    }

    async function updateUser(formData: TUserProfile) {
        try {
            updating.value = true;

            // Update profile
            const response = await $fetch(USER_UPDATE, {
                method: "PUT",
                body: formData,
            });

            toast.add({ title: "Success", description: "Profile updated successfully!", color: "success" });
            user.value = cloneDeep(response as TAPIResponseSuccess<TUserProfile>).data;
        } catch (e) {
            const error = e as TAPIResponseError;
            const message = error.message || "Something went wrong! Please try again later.";
            toast.add({ title: "Error", description: message, color: "error" });
            console.error(error);
        } finally {
            updating.value = false;
        }
    }

    async function deleteUser() {
        try {
            deleting.value = true;

            await $fetch(USER_DELETE, {
                method: "DELETE",
            });

            toast.add({
                title: "Account Deleted",
                description: "Your account has been deleted successfully.",
                color: "success",
            });

            // Redirect to signin
            await navigateTo(ROUTE_SIGNIN);
        } catch (e) {
            const error = e as TAPIResponseError;
            const message = error.message || "Failed to delete account. Please try again.";
            toast.add({
                title: "Error",
                description: message,
                color: "error",
            });
            console.error(error);
        } finally {
            deleting.value = false;
        }
    }

    return {
        CURRENCY_OPTIONS,
        user,
        userKey,
        currency,

        loading,
        updating,
        deleting,

        fetchUser,
        updateUser,
        deleteUser,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

export default useUserStore;
