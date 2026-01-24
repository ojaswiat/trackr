import { sql } from "drizzle-orm";
import {
    check,
    index,
    integer,
    numeric,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).unique(),
    first_name: varchar({ length: 30 }),
    last_name: varchar({ length: 30 }),
    email: varchar().notNull().unique(),

    currency: varchar({ length: 3 }).notNull().default("GBP"),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("users_email_idx").on(table.email),
]);

// User can only have 5 accounts at max - add a trigger to check this
export const accounts = pgTable("accounts", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 30 }).notNull(),
    user_id: uuid().references(() => users.id, { onDelete: "cascade" }).notNull(),
    description: varchar({ length: 60 }).notNull(),
    color: varchar({ length: 7 }).notNull(), // Hex color: #RRGGBB
    initial_balance: numeric({ precision: 10, scale: 2 }).notNull().default("0.00"),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("acconts_user_id_idx").on(table.user_id),
]);

// type TAccount = typeof accounts.$inferSelect;

export const categories = pgTable("categories", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 30 }).notNull(),

    description: varchar({ length: 60 }),
    type: integer().notNull(),
    color: varchar().notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    check(
        "categories_type_valid", // constraint name
        sql`${table.type} IN (0, 1)`, // condition
    ),
]);

export const transactions = pgTable("transactions", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    user_id: uuid().references(() => users.id, { onDelete: "cascade" }).notNull(),
    type: integer().notNull(),
    category_id: uuid().references(() => categories.id).notNull(), // Don't delete when category is deleted - can be null for Income type transactions
    account_id: uuid().references(() => accounts.id, { onDelete: "set null" }), // Users have option to delete account without deleting the transaction
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    description: varchar({ length: 60 }).notNull(),
    transaction_date: timestamp("transaction_date").defaultNow().notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("transaction_category_id_idx").on(table.category_id),
    index("transaction_account_id_idx").on(table.account_id),
    index("transaction_user_id_idx").on(table.user_id),
    index("transaction_type_idx").on(table.type),
    index("transaction_transaction_date_idx").on(table.transaction_date),
    check(
        "transactions_type_valid", // constraint name
        sql`${table.type} IN (0, 1)`, // condition
    ),
]);
