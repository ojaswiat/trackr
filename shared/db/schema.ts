import { sql } from "drizzle-orm";
import {
    check,
    index,
    integer,
    numeric,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 30 }).notNull(),
    email: varchar().notNull().unique(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("email_idx").on(table.email),
]);

export const accountsTable = pgTable("accounts", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 30 }).notNull(),
    user_id: uuid().references(() => users.id, { onDelete: "cascade" }).notNull(),
    description: varchar({ length: 60 }),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("user_id_idx").on(table.user_id),
]);

export const categoriesTable = pgTable("categories", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 30 }).notNull(),
    user_id: uuid().references(() => users.id, { onDelete: "cascade" }).notNull(),
    description: varchar({ length: 60 }),
    type: integer().notNull(),
    color: varchar().notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("user_id_idx").on(table.user_id),
    check(
        "type_valid", // constraint name
        sql`${table.type} IN (0, 1)`, // condition
    ),
]);

export const transactionsTable = pgTable("transactions", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    user_id: uuid().references(() => users.id, { onDelete: "cascade" }).notNull(),
    type: integer().notNull(),
    category_id: uuid().references(() => categoriesTable.id).notNull(), // Don't delete when category is deleted
    account_id: uuid().references(() => accountsTable.id).notNull(), // Users have option to delete account without deleting category
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    description: varchar({ length: 60 }),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}, (table) => [
    index("category_id_idx").on(table.category_id),
    index("account_id_idx").on(table.account_id),
    index("user_id_idx").on(table.user_id),
    index("type_idx").on(table.type),
    check(
        "type_valid", // constraint name
        sql`${table.type} IN (0, 1)`, // condition
    ),
]);
