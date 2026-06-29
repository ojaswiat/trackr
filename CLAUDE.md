# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (port 3000, with inspector)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm typecheck    # Vue + TS type checking (run before committing)
pnpm clean        # Remove .nuxt, .output, .data
pnpm db:generate  # Generate Drizzle migrations from schema
pnpm db:push      # Apply schema to DB (dev)
pnpm db:migrate   # Run migrations (production)
```

There are no automated tests — API changes are verified manually.

## Architecture

**Stack**: Nuxt 4 (Vue 3) + Nuxt UI (Tailwind), PostgreSQL + Drizzle ORM (beta), Supabase Auth, Pinia

**Top-level directories**:
- `app/` — frontend: pages, components, stores, composables, utils
- `server/` — backend: API routes, handlers, middleware, utils
- `shared/` — code used by both sides: DB schema, Zod schemas, entity types, constants

**Data flow**: UI Component → `$fetch(API_CONST)` → `server/api/**/*.ts` → `server/handlers/*.handler.ts` → Drizzle DB

## Core Patterns

### 3-Layer API Architecture

Every feature follows this strict pattern — look at `server/api/accounts/add.post.ts` as the canonical example:

1. **Shared Zod schema** (`shared/schemas/zod.schema.ts`) — validates request body; use `z.coerce.number()` for numeric fields to handle JSON string coercion
2. **Handler** (`server/handlers/*.handler.ts`) — pure DB functions only; never throw HTTP errors; separate "check" functions (return bool) from "action" functions (return data with explicit types)
3. **API route** (`server/api/**/*.{post,get,put,delete}.ts`) — validate → check permissions → execute → return `{ statusCode, statusMessage, message, data }`; wrap in try/catch, rethrow `H3Error`, catch unknown as 500

### Authentication

Server middleware `server/middleware/01.auth.ts` sets `event.context.user` (type `TUser`) on protected routes. Protected route list lives in `server/constants/server.const.ts`. Demo-user write protection is in `server/middleware/02.is-demo.ts`.

Frontend route guarding is in `app/middleware/01.auth.global.ts`.

### Frontend Conventions

- Use `v-model.number` on numeric inputs to keep state as a number
- Pass shared Zod schemas to `UForm` via `:schema="ZSchema"`
- Call APIs using constants from `shared/constants/api.const.ts` (e.g., `ACCOUNTS_ADD`), never hardcode paths
- Use route constants from `app/constants/route.const.ts` (e.g., `ROUTE_DASHBOARD`), never hardcode routes
- Pinia stores in `app/stores/` — `UserStore.ts` manages profile, `CategoryStore.ts` manages categories

### Naming Conventions

- Types: `T` prefix — `TUser`, `TAccount`, `TTransaction`
- API routes: HTTP method suffix — `add.post.ts`, `fetch.get.ts`, `[id].delete.ts`
- Stores: PascalCase + "Store" suffix — `UserStore.ts`
- Constants: SCREAMING_SNAKE_CASE

### Database

- Schema defined in `shared/db/schema.ts`; Drizzle instance in `server/utils/db.ts`
- Money fields: `numeric(10, 2)` — never floats
- Primary keys: UUIDs
- Never edit migration files manually — always use `db:generate` then `db:push`

## Key Files

| File | Purpose |
|------|---------|
| `shared/constants/api.const.ts` | All API endpoint constants |
| `shared/constants/enums.ts` | `TransactionType` (income=0, expense=1), category type |
| `shared/schemas/zod.schema.ts` | All Zod validation schemas |
| `shared/types/entity.types.ts` | `TUser`, `TAccount`, `TTransaction`, `TCategory` |
| `server/constants/server.const.ts` | Protected routes list, HTTP status messages |
| `server/utils/db.ts` | Drizzle DB instance — all queries go through here |
| `app/utils/formatting.ts` | Date and currency formatting utilities |

## Constraints

- Max 5 accounts per user — enforced by DB trigger and handler check
- Demo users are read-only — all mutation routes blocked by `02.is-demo.ts`
- Transaction categories required only for expenses
- `@nuxtjs/supabase` is pinned to `1.5.0` — check compatibility before upgrading
