/**
 * Global event bus for transaction CRUD operations with optimistic updates
 * Allows components to trigger optimistic updates and refreshes across the app
 */

type TOptimisticCallback = {
    onAdd?: (transaction: TTransaction) => void;
    onUpdate?: (transaction: TTransaction) => void;
    onDelete?: (transactionId: string) => void;
};

// Store all refresh callbacks and optimistic update handlers
const refreshCallbacks = ref<Set<() => Promise<void>>>(new Set());
const optimisticCallbacks = ref<Set<TOptimisticCallback>>(new Set());

export default function useTransactionActions() {
    /**
     * Register a refresh callback (called by dashboard and transactions page)
     * @param callback - Async function to refresh transactions
     */
    function registerRefreshCallback(callback: () => Promise<void>) {
        refreshCallbacks.value.add(callback);

        onUnmounted(() => {
            refreshCallbacks.value.delete(callback);
        });
    }

    /**
     * Register optimistic update handlers
     * @param callbacks - Object with onAdd, onUpdate, onDelete functions
     */
    function registerOptimisticCallbacks(callbacks: TOptimisticCallback) {
        optimisticCallbacks.value.add(callbacks);

        onUnmounted(() => {
            optimisticCallbacks.value.delete(callbacks);
        });
    }

    /**
     * Apply optimistic add to all registered handlers
     * @param transaction - The newly created transaction
     */
    function applyOptimisticAdd(transaction: TTransaction) {
        optimisticCallbacks.value.forEach((callbacks) => {
            callbacks.onAdd?.(transaction);
        });
    }

    /**
     * Apply optimistic update to all registered handlers
     * @param transaction - The updated transaction
     */
    function applyOptimisticUpdate(transaction: TTransaction) {
        optimisticCallbacks.value.forEach((callbacks) => {
            callbacks.onUpdate?.(transaction);
        });
    }

    /**
     * Apply optimistic delete to all registered handlers
     * @param transactionId - The ID of deleted transaction
     */
    function applyOptimisticDelete(transactionId: string) {
        optimisticCallbacks.value.forEach((callbacks) => {
            callbacks.onDelete?.(transactionId);
        });
    }

    /**
     * Trigger all registered refresh callbacks (fallback if optimistic update fails)
     */
    async function triggerTransactionRefresh() {
        await Promise.all(Array.from(refreshCallbacks.value).map(callback => callback()));
    }

    return {
        registerRefreshCallback,
        registerOptimisticCallbacks,
        applyOptimisticAdd,
        applyOptimisticUpdate,
        applyOptimisticDelete,
        triggerTransactionRefresh,
    };
}

