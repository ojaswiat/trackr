# AI Agent Quick Reference Checklist

Use this checklist while developing features for Trackr. **Run these checks before committing any code.**

---

## 🔴 CRITICAL: Numeric Handling (Most Common Bug)

Every numeric field needs THREE points of handling:

### ✅ Schema Validation (`shared/schemas/zod.schema.ts`)

```typescript
// ✅ CORRECT
const ZAddAccountSchema = z.object({
  balance: z.coerce.number().positive('Balance must be positive'),
});

// ❌ WRONG
const ZAddAccountSchema = z.object({
  balance: z.number(), // Won't coerce strings!
});
```

### ✅ Frontend Binding (`app/components/AccountAddForm.vue`)

```vue
<!-- ✅ CORRECT -->
<input v-model.number="form.balance" type="number" />

<!-- ❌ WRONG -->
<input v-model="form.balance" type="number" /> <!-- Keeps as string! -->
```

### ✅ Handler Return (`server/handlers/account.handler.ts`)

```typescript
// ✅ CORRECT
export async function addAccountForUser(userId: string, data: TAddAccount): Promise<TAccount> {
  const result = await db.insert(accountsTable).values({...}).returning();
  return {
    ...result[0],
    balance: Number(result[0].balance), // Drizzle returns Decimal!
  };
}

// ❌ WRONG
export async function addAccountForUser(userId: string, data: TAddAccount): Promise<TAccount> {
  const result = await db.insert(accountsTable).values({...}).returning();
  return result[0]; // balance is Decimal, not number!
}
```

---

## 🔵 API Development (3-Layer Pattern)

When adding a new API endpoint, follow this exact order:

### 1️⃣ Create Zod Schema in `shared/schemas/zod.schema.ts`

```typescript
export const ZUpdateAccountSchema = z.object({
  name: z.string().min(1),
  balance: z.coerce.number(), // If numeric!
});
```

### 2️⃣ Create Handler(s) in `server/handlers/account.handler.ts`

Split into "check" (return boolean) and "action" (return data):

```typescript
// Check function
export async function checkCanUserUpdateAccount(userId: string, accountId: string): Promise<boolean> {
  const account = await db.select().from(accountsTable)
    .where(and(eq(accountsTable.id, accountId), eq(accountsTable.user_id, userId)));
  return account.length > 0;
}

// Action function
export async function updateAccountForUser(userId: string, accountId: string, data: TUpdateAccount): Promise<TAccount> {
  const updated = await db.update(accountsTable)
    .set(data)
    .where(and(eq(accountsTable.id, accountId), eq(accountsTable.user_id, userId)))
    .returning();
  
  return {
    ...updated[0],
    balance: Number(updated[0].balance), // Cast numeric fields!
  };
}
```

### 3️⃣ Create API Route in `server/api/accounts/update.put.ts`

```typescript
export default defineEventHandler(async (event) => {
  try {
    // 1. Validate input
    const body = await readBody(event);
    const result = ZUpdateAccountSchema.safeParse(body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid input',
        data: { errors: result.error.flatten() },
      });
    }

    // 2. Get auth context
    const user = event.context.user;
    if (!user) throw createError({ statusCode: 401 });

    // 3. Check permissions/limits
    const canUpdate = await checkCanUserUpdateAccount(user.id, body.accountId);
    if (!canUpdate) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Account not found',
      });
    }

    // 4. Execute action
    const updated = await updateAccountForUser(user.id, body.accountId, result.data);

    // 5. Return structured response
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'Account updated',
      data: { account: updated },
    };
  } catch (err) {
    if (err instanceof H3Error) throw err;
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to update account',
    });
  }
});
```

### 4️⃣ Use in Component (`app/components/AccountEditForm.vue`)

```vue
<template>
  <UForm :schema="ZUpdateAccountSchema" :state="form" @submit="handleSubmit">
    <UFormGroup label="Name" name="name">
      <UInput v-model="form.name" />
    </UFormGroup>
    <UFormGroup label="Balance" name="balance">
      <UInput v-model.number="form.balance" type="number" />
    </UFormGroup>
    <UButton type="submit">Update</UButton>
  </UForm>
</template>

<script setup lang="ts">
import { ZUpdateAccountSchema } from '~/shared/schemas/zod.schema';

const form = reactive({ name: '', balance: 0 });

const handleSubmit = async () => {
  try {
    await $fetch(ACCOUNT_UPDATE, { method: 'PUT', body: form });
    // Success! Show toast, etc.
  } catch (err) {
    // API error already has message field
    console.error(err.data.message);
  }
};
</script>
```

---

## 🟣 Transaction Category Rules

**RULE**: Categories are required for **expenses only**, optional for **income**.

When adding a transaction:

```typescript
// ✅ CORRECT
if (transactionType === TransactionType.EXPENSE && !categoryId) {
  throw createError({
    statusCode: 400,
    message: 'Category required for expenses',
  });
}

// ❌ WRONG
if (!categoryId) { // All transactions need category!
  throw createError({ statusCode: 400, message: 'Category required' });
}
```

In Zod schema:

```typescript
// ✅ CORRECT
const ZAddTransactionSchema = z.object({
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
  categoryId: z.string().optional(), // Optional by default
}).refine(
  (data) => data.type === TransactionType.INCOME || data.categoryId,
  { message: 'Category required for expenses', path: ['categoryId'] }
);

// ❌ WRONG
const ZAddTransactionSchema = z.object({
  categoryId: z.string(), // Never optional!
});
```

---

## 🟢 Form & UForm Integration

**For every form field with validation:**

1. Define Zod schema in `shared/schemas/zod.schema.ts`
2. Import schema and bind to UForm: `:schema="ZSchema"`
3. For numeric inputs: use `v-model.number`
4. For text: use `v-model`
5. Wrap API call in try/catch
6. Display error message from API response

```vue
<template>
  <UForm :schema="ZAddAccountSchema" :state="form" @submit="handleSubmit">
    <UFormGroup label="Account Name" name="name">
      <UInput v-model="form.name" />
    </UFormGroup>
    <UFormGroup label="Balance" name="balance">
      <UInput v-model.number="form.balance" type="number" />
    </UFormGroup>
    <UButton :loading="loading" type="submit">Add Account</UButton>
  </UForm>
  <UAlert v-if="error" color="red" :description="error" />
</template>

<script setup lang="ts">
const form = reactive({ name: '', balance: 0 });
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await $fetch(ACCOUNT_ADD, { method: 'POST', body: form });
    // Success! Update store, navigate, etc.
    userStore.addAccount(data.account);
  } catch (err) {
    error.value = err.data?.message || 'Failed to add account';
  } finally {
    loading.value = false;
  }
};
</script>
```

---

## 🟡 API Constants (Never Hardcode Paths!)

Always use constants from `shared/constants/api.const.ts`:

```typescript
// ✅ CORRECT
import { ACCOUNT_ADD, ACCOUNT_UPDATE, ACCOUNT_DELETE } from '~/shared/constants/api.const';

await $fetch(ACCOUNT_ADD, { method: 'POST', body: data });

// ❌ WRONG
await $fetch('/api/accounts/add', { method: 'POST', body: data });
```

Before adding a new feature:
1. Check `shared/constants/api.const.ts` for existing endpoint
2. If not found, add it: `export const ACCOUNT_FEATURE = '/api/accounts/feature';`

---

## 🟠 Database Access (Drizzle ORM)

**RULE**: All DB queries go through the singleton in `server/utils/db.ts`.

```typescript
// ✅ CORRECT
import { db } from '~/server/utils/db';

const accounts = await db.select().from(accountsTable)
  .where(eq(accountsTable.user_id, userId));

// ❌ WRONG
import { createClient } from '@supabase/supabase-js';
const client = createClient(...); // Don't create new instances!
```

**Important**: 
- Foreign keys **cascade on delete** (e.g., delete account → delete transactions)
- Never edit migration files manually
- After schema change: `pnpm db:generate` → `pnpm db:push`

---

## 📋 Pre-Commit Checklist

Before committing, run:

```bash
# 1. Type checking (MUST pass)
pnpm typecheck

# 2. Linting (MUST pass)
pnpm lint

# 3. Manual testing
# - Test via browser with dev tools Network tab open
# - Verify numeric types in API responses (should be numbers, not strings)
# - Test error scenarios (missing field, invalid input, etc.)
```

**Commit only if**:
- ✅ `pnpm typecheck` passes
- ✅ `pnpm lint` passes
- ✅ All numeric fields cast with `Number()` in handlers
- ✅ All numeric inputs use `v-model.number`
- ✅ All schemas use `z.coerce.number()` for numerics
- ✅ No hardcoded API paths (use constants)
- ✅ Transaction category rule followed (required for expense, optional for income)
- ✅ API responses use standard format: `{ statusCode, statusMessage, message, data }`
- ✅ API calls wrapped in try/catch
- ✅ Handler return types are explicit

---

## 🆘 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ZodError: expected number, received string` | Missing `z.coerce.number()` | Update schema with coerce |
| API returns `"123"` instead of `123` | Missing `Number()` cast in handler | Cast all numeric DB values |
| Form validation doesn't run | Missing `:schema="ZSchema"` on UForm | Bind schema to form |
| Input stays as string | Missing `v-model.number` | Add `.number` modifier |
| 404 on API call | Hardcoded wrong path | Use constant from `api.const.ts` |
| Demo user can mutate data | Demo check not in handler | Add permission check before action |
| TypeScript errors at build | Missing explicit return types | Add `Promise<TType>` to handler |

---

## 🔗 Key Files Reference

| File | Purpose | Link |
|------|---------|------|
| `shared/schemas/zod.schema.ts` | All validation schemas | [View](shared/schemas/zod.schema.ts) |
| `shared/constants/api.const.ts` | API endpoint paths | [View](shared/constants/api.const.ts) |
| `server/handlers/*.handler.ts` | Business logic functions | [View](server/handlers/) |
| `server/api/**/` | HTTP routes | [View](server/api/) |
| `server/utils/db.ts` | Drizzle DB singleton | [View](server/utils/db.ts) |
| `shared/db/schema.ts` | Drizzle table definitions | [View](shared/db/schema.ts) |
| `app/stores/UserStore.ts` | Example Pinia store | [View](app/stores/UserStore.ts) |
| `.github/copilot-instructions.md` | Full guidelines | [View](.github/copilot-instructions.md) |

---

**Last Updated**: June 2026 | Trackr Codebase v1.0
