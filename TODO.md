# Trackr - Personal Finance Tracker

## Project Overview

Trackr is a modern personal finance application built with **Nuxt 3**, **Drizzle ORM**, **PostgreSQL**, and **Nuxt UI**. It allows users to manage accounts, track transactions, and visualize their financial health.

## Architecture & Contribution Guidelines

To ensure consistency, follow this pattern when adding new features:

1.  **Database**: Define schema in `shared/db/schema.ts`.
2.  **Types**: Update TypeScript types in `shared/types/entity.types.ts`.
3.  **Validation**: Create Zod schemas in `shared/schemas/zod.schema.ts`.
4.  **Logic**: Implement business logic in `server/handlers/{resource}.handler.ts`.
5.  **API**: Create endpoints in `server/api/{resource}/` that call the handlers.
6.  **UI**: Build components in `app/components/` and pages in `app/pages/`.

---

## 🚀 Development Roadmap

### ✅ Completed

- [x] **Database Schema**: Users, Accounts, Categories, Transactions tables setup.
- [x] **Authentication**: Middleware and basic auth flow.
- [x] **Accounts Module**: CRUD operations (Create, Read, Update, Delete).
- [x] **Transactions Module**: CRUD operations with `transaction_date` support.
- [x] **Categories Module**: Database fetching implementation.

### 🚧 In Progress / Planned

#### 1. Backend API Enhancements

- [x] **Category Statistics Handler**
    - _Goal_: Calculate total spending/income per category to drive charts.
    - _Action_: Update `category.handler.ts` to include a join with `transactions`.
    - _Logic_: Group transactions by `category_id` and sum `amount`. Map this back to the category list.
    - _Output_: Return `TCategory[]` where `total_amount` is populated.
- [x] **Dashboard Aggregation API** (`/api/dashboard/fetch`)
    - _Goal_: specific API for the dashboard to reduce client-side calculation and multiple network round-trips.
    - _Action_: Create `server/handlers/dashboard.handler.ts` and `server/api/dashboard/fetch.get.ts`.
    - _Metrics Needed_:
        - **Net Worth**: Sum of `initial_balance` + (Income - Expense) for all accounts.
        - **Monthly Overview**: Total Income vs Total Expense for the current month.
        - **Recent Activity**: The last 5 transactions sorted by `transaction_date` desc.
        - **Category Breakdown**: Spending aggregated by category (for Pie Chart).
- [x] **Pagination System (Cursor-Based)**
    - _Why Cursor?_: Better performance for large tables and stable infinite scrolling compared to offset-based pagination.
    - _Backend Implementation_:
        - **Schema**: No changes needed (using `transaction_date` or `created_at` as cursor).
        - **Handler (`transaction.handler.ts`)**: Update `getAllTransactionsForUser` to accept:
            - `limit`: (number, default 20)
            - `cursor`: (string, ISO date string of the last fetched transaction).
        - **Query Logic**: `WHERE transaction_date < cursor ORDER BY transaction_date DESC LIMIT limit`.
        - **Response Format**:
            ```ts
            {
              data: transactions,
              meta: {
                next_cursor: "2023-10-27T10:00:00Z", // null if no more items
                has_more: true
              }
            }
            ```
    - _API Layer_: Update `fetch.get.ts` to parse `query.limit` and `query.cursor`.
- [ ] **Global Date Filters**
    - _Goal_: Filter data by date range (e.g., "This Month", "Last 30 Days").
    - _Action_: Add `startDate` and `endDate` parameters to `dashboard` and `transactions` handlers.
    - _Logic_: Use Drizzle's `gte` (greater than or equal) and `lte` (less than or equal) on `transaction_date`.

#### 2. User Management (Profile & Settings)

- [ ] **User Profile API**
    - _Action_: Create `server/api/user/update.put.ts`.
    - _Validation_: Allow updates ONLY for `first_name`, `last_name`, and `currency`.
    - _Handler_: Add `updateUser` function in `server/handlers/user.handler.ts`.
- [ ] **Account Deletion (Danger Zone)**
    - _Action_: Create `server/api/user/delete.delete.ts`.
    - _Logic_: Cascade delete (or soft delete) all user accounts and transactions.
- [ ] **Frontend Profile Page** (`app/pages/profile.vue`)
    - _UI_: Add a form pre-filled with user data.
    - _Integration_: Connect to the new update API with success/error toasts.

#### 3. Frontend Integration & UX

- [ ] **Dashboard Integration**
    - _Data Fetching_: Use `useAsyncData` with the new Dashboard API.
    - _State Management_: Pass the fetched data to `DashboardCharts.vue` and `TransactionRecentList.vue` props.
    - _Date Filter_: Bind a Date Range Picker to the API query params. When changed, `refresh()` the `useAsyncData`.
- [ ] **Infinite Scroll for Transactions**
    - _Component_: `TransactionsTable.vue`.
    - _Logic_:
        1.  Initial load: Fetch first 20 items.
        2.  Detect scroll to bottom (using `IntersectionObserver` or Nuxt UI's infinite scroll helper).
        3.  Trigger fetch with `cursor = last_transaction.date`.
        4.  **Append** new results to the existing `transactions` array (do not replace).
    - _Edge Cases_: Handle "No more data" state to stop fetching.
- [ ] **Feedback Systems**
    - _Toasts_: Ensure `useToast()` is used for all success/error actions.
    - _Error Handling_: Display user-friendly messages from the API (e.g., "Validation failed" -> "Please check the amount field").
- [ ] **Loading States**
    - _Skeletons_: Add `<USkeleton />` placeholders matching the shape of:
        - Transaction rows (Table).
        - Dashboard cards (Net Worth, Income/Expense).
        - Charts (Circular skeleton or empty state).
    - _Buttons_: Ensure "Save" buttons show a spinner (`loading` prop) during API calls.
- [ ] **Responsiveness**
    - _Mobile Tables_: On small screens, switch `UTable` to a card-based layout or ensure horizontal scrolling is smooth.
    - _Navigation_: Verify the Sidebar/Header behavior on mobile (collapsible menu).

#### 4. Documentation & Deployment

- [ ] **Developer Documentation** (`README.md`)
    - **Setup**: Steps to run `pnpm install`, `pnpm db:generate`, `pnpm dev`.
    - **Env Vars**: List required keys (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`).
    - **Auth Setup**: Guide for Google/GitHub OAuth configuration in Supabase.
- [ ] **Production Readiness**
    - Create static pages: `privacy.vue`, `terms.vue`.
    - **SEO**: Add `useHead` with titles and descriptions to all pages.
    - **Deployment**: Verify Vercel configuration (`vercel.json` if needed).

#### 5. Future Scalability (Optional)

- [ ] **System Design Presentation**: Slides on scaling DB (sharding), caching (Redis), and CDN usage.
