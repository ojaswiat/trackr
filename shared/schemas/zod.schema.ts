import { email, z } from "zod";
import { TRANSACTION_TYPE } from "../constants/enums";

export const ZAddAccountSchema = z.object({
    name: z.string().min(1, "Account name is required").max(30, "Account name must be 30 characters or less"),
    initial_balance: z.coerce.number().min(0, "Initial balance must be positive"),
    color: z.string().min(1, "Please choose a color for this account"),
    description: z.string().max(60, "Description must be 60 characters or less").optional(),
});

export const ZEditAccountSchema = ZAddAccountSchema;

export const ZDeleteAccountSchema = z.object({
    keep_transactions: z.boolean().default(true),
});

export const ZAddTransactionSchema = z.object({
    type: z
        .number()
        .refine((val) => val === 0 || val === 1, {
            message: "Type is required",
        }),
    transaction_date: z
        .string()
        .min(1, { message: "Date is required" })
        .refine((val) => {
            if (!val) {
                return false;
            }
            const date = new Date(val);
            return !Number.isNaN(date.getTime());
        }, { message: "Date must be a valid date" }),
    category_id: z
        .uuidv4()
        .min(1, { message: "Category is required" }),
    account_id: z
        .uuidv4()
        .min(1, { message: "Account is required" }),
    amount: z.number().min(0.01, { message: "Amount must be greater than 0.00" }),
    description: z
        .string()
        .min(1, { message: "Description is required" })
        .max(60, { message: "Description must be at most 60 characters" }),
}).refine((data) => {
    // Category required ONLY for expense (type === 1)
    if (data.type === TRANSACTION_TYPE.EXPENSE && !data.category_id?.trim()) {
        return false;
    }
    return true;
}, {
    message: "Category is required for expenses",
    path: ["category"], // Error shows on category field
});

export const ZEditTransactionSchema = ZAddTransactionSchema;

export const ZUserProfileSchema = z.object({
    id: z.string(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    email: z.email(),
    currency: z.string().default("GBP").optional(),
});

export type TUserProfile = z.infer<typeof ZUserProfileSchema>;

export const ZDashboardFilterSchema = z.object({
    startDate: z.string().optional().refine((date) => !date || !Number.isNaN(Date.parse(date)), {
        message: "Invalid start date format",
    }),
    endDate: z.string().optional().refine((date) => !date || !Number.isNaN(Date.parse(date)), {
        message: "Invalid end date format",
    }),
    account_id: z.string().optional(),
});

export type TDashboardFilter = z.infer<typeof ZDashboardFilterSchema>;
