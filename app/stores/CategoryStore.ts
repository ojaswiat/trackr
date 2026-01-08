import { reduce } from "lodash-es";
import { acceptHMRUpdate, defineStore } from "pinia";

const useCategoryStore = defineStore("CategoryStore", () => {
    const { data: categoriesRepsonse, refresh: fetchCategories, pending: loadingCategories } = useFetch(CATEGORIES_FETCH);

    const categories = computed<TCategoryList>(() => {
        return (categoriesRepsonse.value?.data.categories ?? []) as TCategoryList;
    });

    const categoriesMap = computed<Record<string, TCategory>>(() => {
        const categories = categoriesRepsonse.value?.data.categories ?? [];

        const catMap = reduce(categories, (accumulator, category) => {
            accumulator[category.id] = category as TCategory;
            return accumulator;
        }, {} as Record<string, TCategory>);

        return catMap;
    });

    const categoryColorMap = computed<Record<string, string>>(() => {
        return reduce(
            categoriesMap.value,
            (accumulator, category, categoryId) => {
                accumulator[categoryId] = category.color;
                return accumulator;
            },
            {} as Record<string, string>,
        );
    });

    return {
        categories,
        categoriesMap,
        categoryColorMap,
        loadingCategories,
        fetchCategories,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}

export default useCategoryStore;
