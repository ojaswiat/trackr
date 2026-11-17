# Graph Report - .  (2026-11-17)

## Corpus Check
- Corpus is ~23,363 words - fits in a single context window. You may not need a graph.

## Summary
- 510 nodes · 686 edges · 44 communities (32 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.77)
- Token cost: 0 input · 62,721 output

## Community Hubs (Navigation)
- Server API Routes & Handlers
- Account UI Components
- Accounts Page & Dashboard Filters
- App Shell & Transaction History
- Architecture Docs & Conventions
- Transactions Table
- Lint & DB Tooling Config
- Transaction Add Form
- Transactions Page
- Package Manifest & Scripts
- Runtime Dependencies
- Account Add Form
- Transaction Actions & Dashboard
- Account Delete Form
- Summary & Expense Charts
- UI Type Definitions
- Renovate Config
- Page Header
- Top Nav & Auth
- Account Transactions Chart
- Account Details
- Dashboard Accounts
- Scratch Test Script
- TS Config
- AccountSummary.vue (isolated)
- CategoryExpenses.vue (isolated)
- route.const.ts (isolated)
- ui.const.ts (isolated)
- database.types.ts (isolated)
- ZEditAccountSchema (isolated)
- ZEditTransactionSchema (isolated)

## God Nodes (most connected - your core abstractions)
1. `lodash-es` - 17 edges
2. `scripts` - 14 edges
3. `zod` - 13 edges
4. `pinia` - 9 edges
5. `drizzle-orm` - 8 edges
6. `trackr. Personal Finance Tracker (README)` - 8 edges
7. `@nuxt/ui` - 6 edges
8. `Copilot Instructions for Trackr` - 6 edges
9. `3-Layer API Architecture (Schema -> Handler -> Route)` - 6 edges
10. `getIncomeCategory()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Trackr Application Description` --semantically_similar_to--> `Tech Stack (Nuxt 4, Nuxt UI, Pinia, Zod, Drizzle 1.0 beta, Supabase Auth, Vercel)`  [AMBIGUOUS] [semantically similar]
  about.md → README.md
- `Copilot Instructions for Trackr` --references--> `TODO: Responsive UI (FAB for phone, responsive pages)`  [AMBIGUOUS]
  .github/copilot-instructions.md → TODO.md
- `API Development Pattern` --semantically_similar_to--> `3-Layer API Architecture (Schema -> Handler -> Route)`  [INFERRED] [semantically similar]
  APIPatterns.md → .github/copilot-instructions.md
- `Database Conventions (numeric money, UUID PKs, cascade deletes)` --semantically_similar_to--> `Numeric Input Handling (v-model.number + z.coerce.number + numeric(10,2))`  [INFERRED] [semantically similar]
  README.md → .github/copilot-instructions.md
- `TODO: Deploy to Vercel` --conceptually_related_to--> `trackr. Personal Finance Tracker (README)`  [INFERRED]
  TODO.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **API request flow: auth, demo guard, Zod validation, check/action handlers, structured response** — readme_request_pipeline, _github_copilot_instructions_supabase_auth_middleware, readme_demo_guard, _github_copilot_instructions_three_layer_api_architecture, _github_copilot_instructions_check_vs_action_handlers, _github_copilot_instructions_error_response_format [EXTRACTED 1.00]
- **Numeric/money type consistency across UI, Zod and DB** — _github_copilot_instructions_numeric_input_handling, apipatterns_zaddaccountschema_coerce_fix, readme_money_numeric_convention [INFERRED 0.85]
- **Supabase keep-alive mechanism** — _github_workflows_keepalive_keep_supabase_active, readme_health_check_endpoint, about_database_schema [INFERRED 0.75]

## Communities (44 total, 12 thin omitted)

### Community 0 - "Server API Routes & Handlers"
Cohesion: 0.05
Nodes (43): drizzle-orm, lodash-es, drizzle-orm, DEMO_PROTECTED_ROUTES, PROTECTED_ROUTES, STATUS_CODE_MESSAGE_MAP, deleteAccountForUser(), getAccountDetails() (+35 more)

### Community 1 - "Account UI Components"
Cohesion: 0.05
Nodes (34): emits, { user }, userStore, { currency }, props, selectedAccount, userStore, { currency } (+26 more)

### Community 2 - "Accounts Page & Dashboard Filters"
Cohesion: 0.05
Nodes (26): emits, props, selectedAccount, accountSelectOptions, df, emits, props, selectedAccount (+18 more)

### Community 3 - "App Shell & Transaction History"
Cohesion: 0.06
Nodes (24): chartData, error, fetchTransactionHistory(), loading, props, categoryStore, showAddTransactionModal, sidebar (+16 more)

### Community 4 - "Architecture Docs & Conventions"
Cohesion: 0.08
Nodes (32): Check vs Action Handler Separation, Copilot Instructions for Trackr, Drizzle Kit Migration Workflow, Structured API Response Format {statusCode, statusMessage, message, data}, MAX_ACCOUNTS_PER_USER Limit (5), Numeric Input Handling (v-model.number + z.coerce.number + numeric(10,2)), Supabase Auth Middleware (server/middleware/01.auth.ts), 3-Layer API Architecture (Schema -> Handler -> Route) (+24 more)

### Community 5 - "Transactions Table"
Cohesion: 0.07
Nodes (22): columns, columnVisibility, { currency, user }, emits, props, selectedTransaction, showDeleteTransactionModal, showEditTransactionModal (+14 more)

### Community 6 - "Lint & DB Tooling Config"
Cohesion: 0.08
Nodes (23): @antfu/eslint-config, cross-env, drizzle-kit, eslint, eslint-plugin-format, @nuxt/eslint, devDependencies, @antfu/eslint-config (+15 more)

### Community 7 - "Transaction Add Form"
Cohesion: 0.09
Nodes (23): accountOptions, accounts, { applyOptimisticAdd, applyOptimisticUpdate, triggerTransactionRefresh }, categoryOptions, categoryStore, dateProxy, { expenseCategories, incomeCategory }, form (+15 more)

### Community 8 - "Transactions Page"
Cohesion: 0.10
Nodes (18): accounts, accountsMap, accumulatedTransactions, { allCategories, expenseCategories }, categoriesMap, categoryStore, cursor, { data: transactionsResponse, status, execute: fetchMoreTransactions } (+10 more)

### Community 9 - "Package Manifest & Scripts"
Cohesion: 0.09
Nodes (21): name, cookie, packageManager, pnpm, overrides, private, scripts, build (+13 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): @iconify-json/lucide, @iconify-json/simple-icons, nuxt, nuxt-charts, nuxt-ssr-api-logger, @nuxtjs/supabase, dependencies, @iconify-json/lucide (+13 more)

### Community 11 - "Account Add Form"
Cohesion: 0.15
Nodes (13): adding, colorOptions, edit, emits, initialState, onSubmit(), open, props (+5 more)

### Community 12 - "Transaction Actions & Dashboard"
Cohesion: 0.14
Nodes (10): optimisticCallbacks, refreshCallbacks, TOptimisticCallback, accounts, categoryBreakdown, recentTransactions, { registerRefreshCallback, registerOptimisticCallbacks }, selectedAccount (+2 more)

### Community 13 - "Account Delete Form"
Cohesion: 0.18
Nodes (11): deleting, emits, initialState, onSubmit(), open, props, Schema, state (+3 more)

### Community 14 - "Summary & Expense Charts"
Cohesion: 0.16
Nodes (7): accountsData, amountTypeMultiple, props, xExplicitTicks, categoryExpenseCategories, categoryExpenseChartData, props

### Community 15 - "UI Type Definitions"
Cohesion: 0.22
Nodes (8): TAccountSummary, TAccountTransactionChartData, TAPIResponseError, TAPIResponseSuccess, TCurrency, TDateRange, TTransactionUI, TUISideNavItem

### Community 16 - "Renovate Config"
Cohesion: 0.25
Nodes (7): github>nuxt/renovate-config-nuxt, pnpmDedupe, extends, lockFileMaintenance, enabled, packageRules, postUpdateOptions

### Community 17 - "Page Header"
Cohesion: 0.40
Nodes (5): emits, metaDescription, metaTitle, route, toggleSidbar()

### Community 18 - "Top Nav & Auth"
Cohesion: 0.33
Nodes (3): isLoggedIn, supabase, user

## Ambiguous Edges - Review These
- `Copilot Instructions for Trackr` → `TODO: Responsive UI (FAB for phone, responsive pages)`  [AMBIGUOUS]
  .github/copilot-instructions.md · relation: references
- `Tech Stack (Nuxt 4, Nuxt UI, Pinia, Zod, Drizzle 1.0 beta, Supabase Auth, Vercel)` → `Trackr Application Description`  [AMBIGUOUS]
  about.md · relation: semantically_similar_to

## Knowledge Gaps
- **271 isolated node(s):** `emits`, `userStore`, `{ user }`, `props`, `userStore` (+266 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Copilot Instructions for Trackr` and `TODO: Responsive UI (FAB for phone, responsive pages)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Tech Stack (Nuxt 4, Nuxt UI, Pinia, Zod, Drizzle 1.0 beta, Supabase Auth, Vercel)` and `Trackr Application Description`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `dependencies` connect `Runtime Dependencies` to `Server API Routes & Handlers`, `Package Manifest & Scripts`, `Transactions Table`, `Account UI Components`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `lodash-es` connect `Server API Routes & Handlers` to `Account UI Components`, `Accounts Page & Dashboard Filters`, `App Shell & Transaction History`, `Transactions Table`, `Transaction Add Form`, `Transactions Page`, `Runtime Dependencies`, `Summary & Expense Charts`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Lint & DB Tooling Config` to `Package Manifest & Scripts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `emits`, `userStore`, `{ user }` to the rest of the system?**
  _271 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Server API Routes & Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.05318352059925094 - nodes in this community are weakly interconnected._