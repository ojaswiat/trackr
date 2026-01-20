import { z } from "zod";

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
