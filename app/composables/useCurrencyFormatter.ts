import { APP_CONFIG } from "~~/shared/constants/config.const";

export function useCurrencyFormatter(amount: number, currency?: string): string {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";

    let value: number;
    let suffix: string;

    if (absAmount >= 1e12) {
    // Trillions
        value = absAmount / 1e12;
        suffix = "T";
    } else if (absAmount >= 1e9) {
    // Billions
        value = absAmount / 1e9;
        suffix = "B";
    } else if (absAmount >= 1e6) {
    // Millions
        value = absAmount / 1e6;
        suffix = "M";
    } else if (absAmount >= 1e5) {
    // Lakhs (Indian numbering system)
        value = absAmount / 1e5;
        suffix = "L";
    } else if (absAmount >= 1e3) {
    // Thousands
        value = absAmount / 1e3;
        suffix = "K";
    } else {
    // Less than 1000
        return `${sign}${currency ?? APP_CONFIG.DEFAULT_CURRENCY_SYMBOL}${absAmount.toFixed(2)}`;
    }

    // Format with up to 2 decimal places, removing trailing zeros
    const formatted = Number.parseFloat(value.toFixed(2));

    return `${sign}${currency ?? APP_CONFIG.DEFAULT_CURRENCY_SYMBOL}${formatted}${suffix}`;
}
