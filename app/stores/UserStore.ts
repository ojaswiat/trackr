import { acceptHMRUpdate, defineStore } from "pinia";

const useUserStore = defineStore("UserStore", () => {
    const locale = new Intl.DateTimeFormat().resolvedOptions().locale;

    return {
        locale,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

export default useUserStore;
