# Copilot Instructions for Trackr

Trackr is a personal finance tracker built with Nuxt 4, Drizzle ORM (PostgreSQL), Supabase Auth, and Pinia state management. This guide enables efficient development within the project's established patterns.

## Architecture Overview

**Stack**: Nuxt 4 (Vue 3) + Nuxt UI, PostgreSQL + Drizzle, Supabase Auth, Pinia stores

**Key Directories**:

- `app/` - Frontend (pages, components, stores)
- `server/` - Backend (API routes, handlers, middleware)
- `shared/` - Shared logic (DB schema, Zod schemas, types, constants)

**Data Flow**: UI Component → API Route (`server/api/`) → Handler (`server/handlers/`) → Database → Response

## Core Development Patterns

### 1. API Development (3-Layer Architecture)

Every API follows this strict pattern:

**Shared Schema** (`shared/schemas/zod.schema.ts`):

- Use `z.coerce.number()` for numeric inputs (handles string-to-number conversion)
- Define explicit validation rules with meaningful error messages
- Example: `ZAddAccountSchema` validates account creation with name, balance, color

**Handler** (`server/handlers/*.handler.ts`):

- Pure functions that perform DB operations
- NO HTTP error throwing—return data or booleans
- Separate "check" functions (e.g., `checkCanUserAddAccount`) from "action" functions (e.g., `addAccountForUser`)
- Define explicit return types (`Promise<TAccount>`, `Promise<boolean>`)
- Example: `addAccountForUser(userId, data)` inserts and returns account

**API Route** (`server/api/**/*.post.ts|.get.ts`):

1. Validate input: `ZSchema.safeParse(body)` → throw 400 if invalid
2. Call "check" handlers → throw 403/400 if conditions fail
3. Call "action" handlers → get data
4. Return structured response: `{ statusCode, statusMessage, message, data }`
5. Wrap in try/catch: rethrow `H3Error`, catch unknown as 500

Example flow in [server/api/accounts/add.post.ts](server/api/accounts/add.post.ts):

```
const result = ZAddAccountSchema.safeParse(body);
if (!result.success) throw createError({ statusCode: 400, statusMessage, message });
const canAdd = await checkCanUserAddAccount(user.id);
if (!canAdd) throw createError({ statusCode: 400, statusMessage, message });
const newAccount = await addAccountForUser(user.id, result.data);
return { statusCode: 201, message: "Created!", data: { account: newAccount } };
```

### 2. Frontend Integration

**Components** use Nuxt UI forms + shared Zod schemas:

- Bind inputs correctly: `v-model.number` for numeric fields
- Pass schema to UForm: `:schema="ZAddAccountSchema"`
- Call API: `await $fetch(ACCOUNTS_ADD, { method: 'POST', body: formData })`
- Handle errors: API returns `message` field for UI display
- Example: [app/components/AccountAddForm.vue](app/components/AccountAddForm.vue)

**Stores** (Pinia) manage user/app state:

- Fetch initial data in store initialization
- Mutations update local state
- Actions call API endpoints
- Example: [app/stores/UserStore.ts](app/stores/UserStore.ts) handles user profile

### 3. Database & Types

**Schema** (`shared/db/schema.ts`):

- PostgreSQL via Drizzle ORM (beta version)
- Tables: users, accounts, transactions, categories
- Foreign keys cascade on delete (e.g., accounts → user_id)
- Numeric fields use `numeric(precision, scale)` for money (not floats)

**Entity Types** (`shared/types/entity.types.ts`):

- `TUser`, `TAccount`, `TCategory`, `TTransaction`
- Computed fields added post-query (e.g., `total_income`, `total_expense`)
- Types match Zod schemas (use `z.infer<typeof Schema>` for auto-typing)

### 4. Authentication & Authorization

**Supabase Auth Integration** (`server/middleware/01.auth.ts`):

- User context set on protected routes only
- Protected routes defined in [server/constants/server.const.ts](server/constants/server.const.ts)
- Access user via `event.context.user` (type `TUser`)
- Example: `/api/accounts/*`, `/api/transactions/*` require auth

**Key Constraint**: User can only have MAX_ACCOUNTS_PER_USER accounts (checked in handler, enforced by DB trigger)

## Critical Files & Conventions

| File                                                                 | Purpose                                          |
| -------------------------------------------------------------------- | ------------------------------------------------ |
| [shared/constants/api.const.ts](shared/constants/api.const.ts)       | API endpoint constants (e.g., `ACCOUNTS_ADD`)    |
| [shared/constants/enums.ts](shared/constants/enums.ts)               | Transaction type (income/expense), category type |
| [server/constants/server.const.ts](server/constants/server.const.ts) | Protected routes, HTTP status code messages      |
| [server/utils/db.ts](server/utils/db.ts)                             | Drizzle DB instance, queries must go here        |
| [app/utils/formatting.ts](app/utils/formatting.ts)                   | Date/currency formatting utilities               |

## Specific Patterns

**Numeric Input Handling**:

- Frontend: Use `v-model.number` on input
- Schema: Use `z.coerce.number()` for user input
- DB: `numeric(10, 2)` for money fields
- Reason: JSON serialization converts numbers to strings; coercion ensures consistency

**Error Response Format**:

```
{
  statusCode: 400,
  statusMessage: "Bad Request",
  message: "User-friendly error text",
  data: { field_errors: [...] }
}
```

**Lodash Usage**: Project uses `lodash-es` for utilities (`map`, `reduce`, `find`, `cloneDeep`)

## Development Workflow

```bash
pnpm dev              # Run dev server with hot reload
pnpm lint             # ESLint check
pnpm typecheck        # Vue + TS type checking
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push migrations to DB (dev)
pnpm build            # Production build
```

**Database Migrations**: Use Drizzle Kit (`db:generate`, `db:push`) for schema changes—never edit migrations manually

## Known Constraints & TODOs

- Demo users: UI elements disabled for read-only access (see TODO.md)
- Max 5 accounts per user (enforced by DB trigger + handler check)
- Transaction categories: Required only for expenses, optional for income
- Drizzle ORM: Beta version used (check updates for stability)

## Before Starting Implementation

1. Check if API endpoint exists in [shared/constants/api.const.ts](shared/constants/api.const.ts)
2. Verify Zod schema exists in [shared/schemas/zod.schema.ts](shared/schemas/zod.schema.ts) for the entity
3. Look at similar feature (e.g., accounts) for pattern reference
4. Run `pnpm typecheck` after changes to catch type mismatches
5. Ensure handler returns proper types + API route wraps errors correctly

---

**Last Updated**: January 2026. Based on [APIPatterns.md](APIPatterns.md) and project structure analysis.
