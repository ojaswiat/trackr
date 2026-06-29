# Trackr Codebase Analysis

**Project**: Personal Finance Tracker (Nuxt 4 + PostgreSQL + Supabase)  
**Analysis Date**: 2026-06-29  
**Audience**: AI agents and developers adding features to this codebase

---

## 1. Current Build & Development Workflow

### Package Manager & Versions

- **Package Manager**: `pnpm@10.27.0` (required)
- **Node Runtime**: ES modules only (`"type": "module"`)
- **Key Dependency Pins**:
  - `@nuxtjs/supabase@1.5.0` - **PINNED** (compatibility critical, test before upgrading)
  - `drizzle-orm@1.0.0-beta.10-4a43a22` - Beta version with known quirks
  - `@nuxt/ui@^4.4.0` - Provides form validation, buttons, inputs
  - `zod@^4.3.6` - Runtime validation

### Development Scripts

```bash
pnpm dev        # Start dev server (port 3000, NODE_ENV=development, --inspect flag)
pnpm build      # Production build (outputs to .output/)
pnpm preview    # Serve production build locally
pnpm lint       # ESLint with antfu/eslint-config (strict)
pnpm typecheck  # Vue + TS type checking (MUST run before commits)
pnpm clean      # Remove .nuxt, .output, .data
pnpm db:generate  # Generate Drizzle migrations from schema.ts
pnpm db:push      # Apply migrations to dev DB
pnpm db:migrate   # Run migrations in production
```

### Development Pain Points & Workflows

1. **No automated tests** - API changes verified manually via browser/curl
2. **Dev command includes --inspect** - Node debugger runs on default port (9229)
3. **Manual DB schema management** - Must run `db:generate` after schema changes, then `db:push`
4. **Type checking required** - `typecheck` must pass before committing (Vue + Nuxt generate tsconfig.*)
5. **ESLint is strict** - Uses antfu's opinionated config with custom Vue block order rules
6. **Cross-env needed** - Windows compatibility for NODE_ENV setting
7. **HMR updates** - Pinia stores accept hot module replacement (see store files)

---

## 2. Undocumented Conventions & Patterns

### API Architecture (3-Layer Strict Pattern)

Every API endpoint follows this **exact** structure:

#### Layer 1: Shared Zod Schema (`shared/schemas/zod.schema.ts`)

```typescript
// REQUIRED: z.coerce.number() for all numeric fields
// This handles JSON string→number conversion
export const ZAddAccountSchema = z.object({
    name: z.string().min(1).max(30),
    initial_balance: z.coerce.number(),  // ← MUST coerce
    color: z.string().min(1),
    description: z.string().max(60).optional(),
});
```

**Key Rule**: Use `z.coerce.number()` NOT `z.number()` because form inputs serialize as strings.

#### Layer 2: Handler Function (`server/handlers/*.handler.ts`)

```typescript
// Pure DB operations - NO HTTP error throwing
// Return explicit types
export async function addAccountForUser(
    userId: string,
    data: typeof ZAddAccountSchema._type  // or z.infer<typeof ZAddAccountSchema>
): Promise<TAccount> {
    const account = await db.insert(accounts)
        .values({ ...data, user_id: userId })
        .returning();
    return account[0];
}

// Separate check functions - always return boolean
export async function checkCanUserAddAccount(userId: string): Promise<boolean> {
    const count = await db.select().from(accounts).where(eq(accounts.user_id, userId));
    return count.length < APP_CONFIG.MAX_ACCOUNTS_PER_USER;
}
```

**Key Rules**:
- Never throw `createError()` in handlers
- Always define explicit return types
- Separate permission/limit checks from mutations
- Database numeric values **must be cast**: `Number(field)`

#### Layer 3: API Route (`server/api/accounts/add.post.ts`)

```typescript
export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user as TUser;
        const body = await readBody(event);
        
        // 1. Validate input
        const result = ZAddAccountSchema.safeParse(body);
        if (!result.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid input",
                data: result.error.issues,
            });
        }
        
        // 2. Check permissions/limits
        const canAdd = await checkCanUserAddAccount(user.id);
        if (!canAdd) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                message: `User can only have ${APP_CONFIG.MAX_ACCOUNTS_PER_USER} accounts!`,
            });
        }
        
        // 3. Execute mutation
        const newAccount = await addAccountForUser(user.id, result.data);
        
        // 4. Return standard response
        return {
            statusCode: SERVER_STATUS_CODES.CREATED,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.CREATED],
            message: "Account created successfully!",
            data: { account: newAccount },
        };
    } catch (error) {
        if (isDev()) console.error(error);
        // Rethrow H3Error as-is, catch all else as 500
        throw createError({
            statusCode: SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Internal server error!",
        });
    }
});
```

**Response Format** (always):
```typescript
{
    statusCode: number,              // e.g., 200, 201, 400, 403, 500
    statusMessage: string,           // From STATUS_CODE_MESSAGE_MAP
    message: string,                 // User-friendly error/success message
    data?: any,                      // Payload (omitted on error)
}
```

### Frontend Integration Pattern

#### Components (`app/components/*.vue`)

```vue
<template>
    <UForm :schema="ZAddAccountSchema" :state="state" @submit="onSubmit">
        <!-- v-model.number is REQUIRED for numeric fields -->
        <UInput v-model.number="state.initial_balance" type="number" />
        <!-- ... -->
        <UButton type="submit">Add</UButton>
    </UForm>
</template>

<script setup lang="ts">
import { ACCOUNTS_ADD } from "~~/shared/constants/api.const";  // Use constants
import { ZAddAccountSchema } from "~~/shared/schemas/zod.schema";

const state = reactive({ initial_balance: 0 }); // Keeps as number

async function onSubmit(event: FormSubmitEvent<typeof ZAddAccountSchema>) {
    const response = await $fetch(ACCOUNTS_ADD, {  // Use constant
        method: "POST",
        body: event.data,
    });
    // Handle response.message for UI display
}
</script>
```

#### Stores (`app/stores/*.ts`)

```typescript
const useUserStore = defineStore("UserStore", () => {
    const user = ref<TUserProfile>({} as TUserProfile);
    const loading = ref(false);
    
    async function fetchUser() {
        try {
            loading.value = true;
            const userResponse = await $fetch<TAPIResponseSuccess<TUserProfile>>(USER_FETCH);
            user.value = userResponse.data;
        } catch (e) {
            const error = e as TAPIResponseError;
            toast.add({ title: "Error", description: error.message, color: "error" });
        } finally {
            loading.value = false;
        }
    }
    
    return { user, loading, fetchUser };
});

// HMR support required
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
```

### Database Access Pattern

```typescript
// server/utils/db.ts exports singleton instance
export const db = drizzle(process.env.DATABASE_URL!, { schema });

// In handlers - always import and use db
import { db } from "~~/server/utils/db";

// Numeric fields MUST be cast when returned
const accounts = await db.select().from(accounts);
const results = accounts.map(acc => ({
    ...acc,
    initial_balance: Number(acc.initial_balance),  // ← REQUIRED
}));
```

### Middleware Chain

Two middleware layers run in order:

1. **`01.auth.ts`** - Sets `event.context.user` on protected routes
   - Protected routes defined in `server/constants/server.const.ts::PROTECTED_ROUTES`
   - Throws 401 if user not authenticated

2. **`02.is-demo.ts`** - Blocks demo users from mutation endpoints
   - Restricted routes in `server/constants/server.const.ts::DEMO_PROTECTED_ROUTES`
   - Throws 403 if user is demo

### Constants & Enums

**Transaction Types**:
```typescript
export const TRANSACTION_TYPE = {
    INCOME: 0,
    EXPENSE: 1,
} as const;
```

**Category Types**: Same as transaction types (0=income, 1=expense)

**API Status Codes** (defined in `shared/constants/enums.ts`):
- 200 = OK
- 201 = CREATED
- 400 = BAD_REQUEST
- 401 = UNAUTHORIZED
- 403 = FORBIDDEN
- 404 = NOT_FOUND
- 500 = INTERNAL_SERVER_ERROR

### Naming Conventions

| Category | Convention | Examples |
|----------|-----------|----------|
| Types | `T` prefix | `TUser`, `TAccount`, `TTransaction` |
| API Routes | HTTP method suffix | `add.post.ts`, `fetch.get.ts`, `[id].delete.ts` |
| Stores | PascalCase + "Store" | `UserStore.ts`, `CategoryStore.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ACCOUNTS_PER_USER`, `DEFAULT_CURRENCY` |
| API Endpoints | SCREAMING_SNAKE_CASE with path | `ACCOUNTS_FETCH`, `USERS_UPDATE` |
| Computed/Ref names | camelCase | `isLoading`, `totalAmount` |

---

## 3. Common Pitfalls & Agent Gotchas

### Critical Pitfalls (Breaking)

1. **Missing `z.coerce.number()`** in schemas
   - ❌ `initial_balance: z.number()`
   - ✅ `initial_balance: z.coerce.number()`
   - **Result**: Validation fails when form sends numeric string

2. **Forgetting `Number()` cast on DB numeric fields**
   - ❌ `return { amount: transaction.amount }`
   - ✅ `return { amount: Number(transaction.amount) }`
   - **Result**: API returns string; frontend breaks type checking

3. **Hardcoding API paths**
   - ❌ `await $fetch("/api/accounts/fetch")`
   - ✅ `await $fetch(ACCOUNTS_FETCH)`
   - **Result**: Refactoring breaks; paths in constants for a reason

4. **Not using `v-model.number` on numeric inputs**
   - ❌ `<input v-model="state.balance" type="number">`
   - ✅ `<input v-model.number="state.balance" type="number">`
   - **Result**: String sent to API instead of number; Zod error

5. **Throwing HTTP errors in handlers**
   - ❌ Calling `createError()` in `account.handler.ts`
   - ✅ Return boolean or throw descriptive Error() for API to handle
   - **Result**: Error handling is mixed; API route doesn't control responses

6. **Not checking `APP_CONFIG.MAX_ACCOUNTS_PER_USER` in handlers**
   - ❌ Skipping account limit check
   - ✅ Always call `checkCanUserAddAccount()` before mutation
   - **Result**: User bypasses 5-account limit

### High-Impact Pitfalls

7. **Untyped API responses**
   - ❌ `const res = await $fetch(API_URL);`
   - ✅ `const res = await $fetch<TAPIResponseSuccess<TAccount>>(API_URL);`
   - **Result**: TypeScript can't catch missing fields; runtime errors

8. **Not wrapping API calls in try/catch with error display**
   - ❌ Fire-and-forget `$fetch(URL)` without error handling
   - ✅ Always catch and call `toast.add({ color: "error", ... })`
   - **Result**: User doesn't know if mutation succeeded

9. **Transaction category not optional for income**
   - ❌ Sending `category_id` as required for all transaction types
   - ✅ Category **required only for expense** (type === 1)
   - **Result**: Income transactions fail validation

10. **Not using `$fetch(CONSTANTS)` in API route names**
    - ❌ Using hardcoded route names in components
    - ✅ Import and use `ACCOUNTS_FETCH` etc. from `api.const.ts`
    - **Result**: Route changes break components

### Medium-Impact Pitfalls

11. **Forgetting `await` on async database operations**
    - **Result**: Returns Promise instead of data

12. **Not defining explicit return types on handler functions**
    - **Result**: TypeScript inference fails; API responses untyped

13. **Demo user checking only in UI, not in API**
    - **Result**: API middleware `02.is-demo.ts` should block mutations automatically

14. **Modifying migration files manually**
    - ❌ Editing `.sql` files in `drizzle/` folder
    - ✅ Always use `db:generate` then `db:push`
    - **Result**: Schema & migration get out of sync

15. **Using `z.number()` then binding input with `v-model` (not `.number`)**
    - **Result**: Form sends string, schema validation fails

### Schema & Database Pitfalls

16. **Using floats for money fields**
    - ❌ `numeric(10, 2)` is already defined; don't use
    - ✅ Always use `numeric(10, 2)` for amounts
    - **Result**: Floating-point precision errors in financial calcs

17. **Forgetting to return `Number()` from aggregations**
    - ❌ `SUM()` returns string in Drizzle
    - ✅ Always wrap: `Number(sum(transactions.amount))`
    - **Result**: Calculated totals are strings, break downstream code

---

## 4. Testing Setup

### Current State: NO AUTOMATED TESTS

- **No test framework installed** (no Vitest, Jest, etc.)
- **No test files in repo** (only `test.js` for date/timezone exploration)
- **Manual verification only** - Changes tested in browser/dev server

### Implications for Development

1. API changes must be verified manually:
   - Start dev server: `pnpm dev`
   - Test with browser or curl
   - Check Network tab for requests/responses

2. Type safety is the primary guard:
   - Run `pnpm typecheck` before commits
   - ESLint catches many mistakes: `pnpm lint`

3. UI changes need browser verification (no Cypress/Playwright)

### How to Add Tests (Future)

If tests are added, follow these patterns:

- Use Vitest (Nuxt recommended) or Jest
- Test API handlers in isolation (mock DB)
- Test Zod schemas with many input variations
- Test store mutations with computed watchers
- Test components with @vue/test-utils

---

## 5. Build & Deployment Configuration

### Build Output

```bash
pnpm build
# Outputs to: .output/
# Contains server routes and SSR-built Vue components
```

### Deployment Targets

**Vercel** (primary - see TODO.md):
- Configured for zero-config deployment
- Auto-detects Nuxt 4
- No `vercel.json` found; using defaults
- Environment variables set in Vercel dashboard

**Database**: Supabase (PostgreSQL)
- Connection string: `DATABASE_URL` env var
- Migrations: `db:migrate` (production-safe)

### Environment Variables

```bash
# Required (from .env.example)
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_KEY=<your-supabase-publishable-key>
DATABASE_URL=<postgres-connection-string>

# Optional
DEMO_ACCOUNT_EMAIL=<demo@example.com>
DEMO_ACCOUNT_PASSWORD=<password>
```

### Build Quirks & Configuration

1. **Nuxt compatibility date**: `2025-01-15` (in `nuxt.config.ts`)
   - Locks Nuxt to 2025 feature set; update carefully

2. **Supabase redirect options** (`nuxt.config.ts`):
   - Login redirect: `/signin`
   - Callback: `/confirm` (OAuth callback)
   - Public pages: `/`, `/about`, `/terms`, `/privacy`

3. **ESLint formatting**:
   - Comma dangle: `never` (no trailing commas)
   - Brace style: `1tbs` (one true brace style)
   - Vue block order: `[script, template], style`

4. **TypeScript references**: Auto-generated by Nuxt
   - Includes `.nuxt/tsconfig.app.json`, `.nuxt/tsconfig.server.json`, etc.
   - Never edit manually

5. **Vite config**:
   - SSR no-external: `["to-px"]` (keep in bundle)
   - Tailwind/CSS not explicitly configured (using @nuxt/ui defaults)

### CI/CD Considerations

- **No GitHub Actions** found (no `.github/workflows/`)
- **Renovate config** present (`renovate.json`) - auto-updates dependencies
- **Git hooks**: None detected; `typecheck` must be run manually before commits

### Performance Notes

1. **Drizzle (beta)**: May have performance quirks
   - Monitor N+1 queries (e.g., account totals computed with SQL aggregates)
   - Avoid repeated queries in loops

2. **Numeric precision**: `numeric(10, 2)` is sufficient for currency
   - Precision: 10 digits, 2 decimal places (up to $99,999,999.99)

3. **Indexes**: Database has strategic indexes
   - User email, transaction date ranges, account lookups
   - Check EXPLAIN ANALYZE before adding queries

---

## 6. Architectural Decisions Not in Code

### Why 3-Layer API Pattern?

The Zod→Handler→Route pattern separates concerns:
- **Zod** ensures data shape is correct (contract)
- **Handler** ensures business logic is correct (testable, reusable)
- **Route** ensures HTTP semantics are correct (client communication)

This allows handlers to be called from multiple places (webhooks, scheduled tasks, etc.) without duplicating business logic.

### Why No Initial Balance Transaction?

Comment in `server/api/accounts/add.post.ts`:
> "Didn't create a transaction: the initial balance as an expense may overlap all the categories."

Initial balance is recorded as `account.initial_balance` field, not as a transaction, to avoid category confusion. Income/Expense transactions are recorded separately.

### Why Numeric(10, 2) Not Float?

PostgreSQL `numeric` type:
- Fixed decimal precision (no rounding errors)
- Safe for financial calculations
- Must cast to JavaScript `Number` on retrieval (returns string in some DB drivers)

### Why Drizzle Beta?

Using Drizzle `1.0.0-beta.10-4a43a22`:
- Newer than stable 0.x (which is deprecated)
- Provides TypeScript-first query builder
- Requires careful version pinning (beta = potential breaking changes)

### Why Supabase Auth?

- Handles OAuth (GitHub, Google) out of box
- Provides JWT tokens for API authentication
- Multi-tenant user management without extra setup

### Why Max 5 Accounts?

From `shared/constants/config.const.ts`:
```typescript
MAX_ACCOUNTS_PER_USER: 5
```
Enforced by:
1. Database trigger (SQL constraint)
2. Handler check (`checkCanUserAddAccount`)
3. API route validation
4. UI disables button for demo users

This is a business rule, not a technical limit.

---

## 7. Key Interdependencies & Constraints

### Critical Dependencies

| Dependency | Version | Why | Risk |
|-----------|---------|-----|------|
| @nuxtjs/supabase | 1.5.0 (pinned) | Supabase auth setup | Major upgrade needed for Nuxt 5? |
| drizzle-orm | beta | Type-safe queries | May have breaking changes |
| postgres | ^3.4.8 | DB driver (Drizzle uses it) | Connection stability |
| zod | ^4.3.6 | Runtime validation | Schema changes on major versions |

### Cross-Module Assumptions

- **DB schema** (`shared/db/schema.ts`) must match **Zod schemas** (`shared/schemas/zod.schema.ts`)
  - New DB field → must add to Zod schema
  - Renaming field → update everywhere

- **API constants** must match **actual routes**
  - New route `server/api/foo/bar.post.ts` → add `FOO_BAR = "/api/foo/bar"` to `api.const.ts`

- **Protected routes** in `server/constants/server.const.ts::PROTECTED_ROUTES` must match actual auth needs

- **Types** must match schemas
  - If Zod schema changes, entity type likely needs updating

### Module Export Chain

```
shared/db/schema.ts     ← source of truth for DB structure
    ↓
shared/types/entity.types.ts  ← TAccount, TUser, TTransaction
    ↓
shared/schemas/zod.schema.ts  ← ZAddAccountSchema
    ↓
server/handlers/*.handler.ts  ← validate with schemas, return types
    ↓
server/api/**/*.ts            ← call handlers, return responses
    ↓
app/components/*.vue          ← display data, call APIs
```

Breaking this chain at any point causes downstream failures.

---

## 8. Recommendations for AI Agents

### Before Writing Code

1. **Check if API endpoint exists** in `shared/constants/api.const.ts`
2. **Check if Zod schema exists** in `shared/schemas/zod.schema.ts`
3. **Look at similar feature** (e.g., accounts for accounts, transactions for transactions)
4. **Run `pnpm typecheck`** after changes to catch mismatches
5. **Never hardcode API paths or route names** - use constants

### When Adding a New API

1. Add Zod schema to `shared/schemas/zod.schema.ts`
2. Add handler functions to `server/handlers/entity.handler.ts`
3. Create API route in `server/api/entity/action.http-method.ts`
4. Add endpoint constant to `shared/constants/api.const.ts`
5. Add type to `shared/types/entity.types.ts` if new entity
6. Run `pnpm typecheck && pnpm lint` to verify
7. Test in browser with `pnpm dev`

### When Adding a UI Feature

1. Create component in `app/components/ComponentName.vue`
2. Use Zod schema in `UForm :schema` prop
3. Use API constants (never hardcoded paths)
4. Wrap API calls in try/catch with toast error display
5. Use `v-model.number` on numeric inputs
6. Register refresh/optimistic callbacks if needed (useTransactionActions)

### When Modifying Database

1. Update `shared/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Review migration in `drizzle/` folder
4. Run `pnpm db:push` to apply to dev DB
5. Update `shared/types/entity.types.ts`
6. Update `shared/schemas/zod.schema.ts`
7. Update handlers that touch this entity
8. Update API routes and tests

---

## Summary Checklist for Agents

```
API Development Checklist:
☐ Schema in shared/schemas/zod.schema.ts (with z.coerce for numbers)
☐ Handler functions in server/handlers/*.ts (no HTTP errors, explicit types)
☐ API route in server/api/**/*.ts (validate→check→execute→return)
☐ Endpoint constant in shared/constants/api.const.ts
☐ DB numeric fields cast with Number()
☐ Error responses include message field
☐ Protected routes added to PROTECTED_ROUTES if needed
☐ pnpm typecheck passes
☐ pnpm lint passes
☐ Manual test in browser with pnpm dev

Frontend Development Checklist:
☐ Component uses :schema="ZSchema"
☐ Numeric inputs use v-model.number
☐ API calls use constants (ACCOUNTS_ADD not "/api/accounts/add")
☐ API calls in try/catch with toast error
☐ Routes use constants (ROUTE_DASHBOARD not "/dashboard")
☐ Types imported and used (TAPIResponseSuccess<TData>)
☐ No hardcoded API paths or route names
☐ pnpm typecheck passes
☐ pnpm lint passes
☐ Manual test in browser

Database Changes Checklist:
☐ Schema updated
☐ pnpm db:generate ran successfully
☐ Migration reviewed before pnpm db:push
☐ Numeric fields use numeric(10, 2)
☐ Types updated
☐ Schemas updated
☐ Handlers updated
☐ No manual migration editing
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-29  
**Based on**: Full codebase analysis of /Users/ojaswi/Projects/trackr
