import { reduce } from "lodash-es";
import { acceptHMRUpdate, defineStore } from "pinia";

const useAccountStore = defineStore("AccountStore", () => {
    const { data: accountsResponse, refresh: fetchAccounts, pending: loadingAccounts } = useFetch(ACCOUNTS_FETCH);

    const accounts = computed<TAccountList>(() => {
        return (accountsResponse.value?.data.accounts ?? []) as TAccountList;
    });

    return {
        accounts,
        loadingAccounts,
        fetchAccounts,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}

export default useAccountStore;
