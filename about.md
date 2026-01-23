# Trackr Application Description

## Overview
Trackr is a full-stack personal finance tracking application built with **Nuxt 3**, **TypeScript**, **PostgreSQL**, and **Drizzle ORM**. It allows users to manage accounts, track income and expenses, visualize financial data through a dashboard, and maintain a transaction history.

## Tech Stack
- **Framework**: Nuxt 3 (Vue 3 + Nitro Server)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **State Management**: Pinia
- **Validation**: Zod
- **UI Library**: Nuxt UI / Tailwind CSS
- **Icons**: Lucide Icons / Nuxt Icon

---

## File Structure

### `app/` (Frontend)
Contains the Vue.js frontend application logic and UI.

- **`assets/`**: Static assets like CSS (`main.css`) and data (`locale.json`).
- **`components/`**: Reusable Vue components.
    - **Charts**: `AccountSummaryChart.vue`, `AccountTransactionsChart.vue`, `CategoryExpensesChart.vue`.
    - **Forms**: `AccountAddForm.vue`, `AccountDeleteForm.vue`, `TransactionAddForm.vue`, `TransactionDeleteForm.vue`, `UserProfileUpdateForm.vue`.
    - **Dashboard**: `DashboardAccounts.vue`, `DashboardFilters.vue`, `DashboardSummary.vue`.
    - **Transactions**: `TransactionFilters.vue`, `TransactionRecentList.vue`, `TransactionsTable.vue`.
    - **Layout**: `UIAppFooter.vue`, `UIPageHeader.vue`, `UISideNav.vue`, `UITopNav.vue`.
- **`layouts/`**: Application layouts (`default.vue`, `app.vue`).
- **`middleware/`**: Client-side middleware (`01.auth.global.ts`).
- **`pages/`**: Application routes.
    - `index.vue` (Landing)
    - `signin.vue` (Authentication)
    - `dashboard.vue` (Main Overview)
    - `transactions.vue` (Transaction History)
    - `accounts.vue` (Account Management)
    - `profile.vue` (User Settings)
    - `settings.vue`, `help.vue`, `privacy.vue`, `terms.vue` (Static/Info pages)
- **`stores/`**: Pinia stores.
    - `UserStore.ts`: Manages user locale and preferences.
- **`utils/`**: Frontend utility functions.
    - `formatting.ts`: `useDateTimeFormatter`, `formatCurrency`.
    - `dev.ts`: Development helpers.
- **`types/`**: UI-specific types (`ui.types.ts`).
- **`constants/`**: UI constants (`route.const.ts`, `ui.const.ts`).

### `server/` (Backend)
Contains the API routes and business logic.

- **`api/`**: API Route handlers (Nitro).
    - **`accounts/`**: `fetch.get.ts`, `add.post.ts`, `update/`, `delete/`.
    - **`categories/`**: `fetch.get.ts`, `expenses.post.ts`.
    - **`dashboard/`**: `fetch.get.ts`.
    - **`transactions/`**: `fetch.get.ts`, `add.post.ts`, `update/`, `delete/`.
    - **`user/`**: `fetch.get.ts`, `update.put.ts`, `delete.delete.ts`.
- **`handlers/`**: Business logic layer separating DB operations from API routes.
    - `account.handler.ts`
    - `category.handler.ts`
    - `dashboard.handler.ts`
    - `transaction.handler.ts`
    - `user.handler.ts`
- **`middleware/`**: Server-side middleware (`01.auth.ts`).
- **`utils/`**: Server utilities (`db.ts` for Drizzle instance, `api.utils.ts`).
- **`constants/`**: Server constants (`server.const.ts`).

### `shared/` (Common)
Code shared between frontend and backend.

- **`db/`**: Database configuration.
    - `schema.ts`: Drizzle ORM table definitions.
- **`types/`**: Shared TypeScript interfaces (`entity.types.ts`).
- **`constants/`**: Shared constants (`api.const.ts`, `data.const.ts`, `enums.ts`).
- **`schemas/`**: Zod validation schemas (`zod.schema.ts`).

---

## Database Schema (`shared/db/schema.ts`)

### `users`
- `id`: UUID (PK)
- `first_name`, `last_name`: Varchar
- `email`: Varchar (Unique)
- `currency`: Varchar (Default "GBP")
- `created_at`, `updated_at`: Timestamp

### `accounts`
- `id`: UUID (PK)
- `user_id`: UUID (FK -> users.id, Cascade Delete)
- `name`: Varchar
- `description`: Varchar
- `color`: Varchar (Hex)
- `initial_balance`: Numeric
- `created_at`, `updated_at`: Timestamp

### `categories`
- `id`: UUID (PK)
- `name`: Varchar
- `description`: Varchar
- `type`: Integer (0: Income, 1: Expense)
- `color`: Varchar
- `created_at`, `updated_at`: Timestamp

### `transactions`
- `id`: UUID (PK)
- `user_id`: UUID (FK -> users.id, Cascade Delete)
- `account_id`: UUID (FK -> accounts.id, Set Null)
- `category_id`: UUID (FK -> categories.id)
- `type`: Integer (0: Income, 1: Expense)
- `amount`: Numeric
- `description`: Varchar
- `transaction_date`: Timestamp
- `created_at`, `updated_at`: Timestamp

---

## Handlers & Functions (`server/handlers/`)

### `account.handler.ts`
- `checkAccountExists(accountId)`: Boolean
- `checkAccountBelongsToUser(accountId, userId)`: Boolean
- `getAccountDetails(accountId)`: Returns `TAccount` with calculated `total_income` and `total_expense`.
- `getAllAccountsForUser(userId)`: Returns list of accounts with financial summaries (Income/Expense totals per account).

### `category.handler.ts`
- `getAllCategories()`: Returns static/DB categories.
- `getCategoryStatistics(userId, accountIds?, filters?)`: Returns categories with aggregated `total_amount` based on transactions, supporting date and account filtering.

### `dashboard.handler.ts`
- `getDashboardData(userId, filters?)`: Aggregates data for the dashboard:
    - **Net Worth**: Initial balances + Total Income - Total Expense.
    - **Period Overview**: Income vs Expense for the selected date range.
    - **Recent Transactions**: Last 5 transactions.
    - **Category Breakdown**: Via `getCategoryStatistics`.

### `transaction.handler.ts`
- `checkTransactionExists(transactionId)`: Boolean
- `checkTransactionBelongsToUser(transactionId, userId)`: Boolean
- `canUserUpdateTransaction(transactionId, userId)`: Permission check.
- `getTransactionDetails(transactionId)`: Returns single transaction.
- `getAllTransactionsForUser(userId, filters?, options?)`: Returns paginated transactions list with filtering (Date, Account, Category).

### `user.handler.ts`
- `getUser(userId)`: Fetch user profile.
- `updateUser(userId, payload)`: Update profile (Name, Currency).
- `deleteUser(userId)`: Delete user and cascade delete related data.

---

## API Routes & Endpoints

### User
- `GET /api/user/fetch`: Get current user profile.
- `PUT /api/user/update`: Update user details.
- `DELETE /api/user/delete`: Delete user account.

### Dashboard
- `GET /api/dashboard/fetch`: Get aggregated dashboard data (Net Worth, Summary, Charts).
    - Query Params: `startDate`, `endDate`, `account_id`.

### Transactions
- `GET /api/transactions/fetch`: Get paginated transactions.
- `POST /api/transactions/add`: Create new transaction.
- `PUT /api/transactions/update`: Update existing transaction.
- `DELETE /api/transactions/delete`: Delete transaction.

### Accounts
- `GET /api/accounts/fetch`: Get all user accounts.
- `POST /api/accounts/add`: Create new account.
- `PUT /api/accounts/update`: Update account.
- `DELETE /api/accounts/delete`: Delete account.

### Categories
- `GET /api/categories/fetch`: Get all categories.

---

## Shared Types & Enums

### Types (`TUser`, `TAccount`, `TTransaction`, `TCategory`)
TypeScript interfaces mirroring the database entities, often extending them with computed fields (e.g., `TAccount` includes `total_income`).

### Enums
- **`TRANSACTION_TYPE`**: `INCOME (0)`, `EXPENSE (1)`
- **`CATEGORY_TYPE`**: `INCOME (0)`, `EXPENSE (1)`
- **`SERVER_STATUS_CODES`**: Standard HTTP status codes (200, 201, 400, 404, 500, etc.).

---

## Utils

### Frontend (`app/utils/`)
- **`formatCurrency(amount)`**: Formats numbers to currency strings (e.g., "£1.2k", "£500.00") with suffix support (K, M, B, T).
- **`useDateTimeFormatter(isoString)`**: Converts ISO dates to readable formats (`DD MMM, YYYY` and `HH:MM AM/PM`).

### Server (`server/utils/`)
- **`db.ts`**: Exports the configured Drizzle ORM instance.
- **`api.utils.ts`**: Helper functions for API response formatting and environment checks (`isDev`).

