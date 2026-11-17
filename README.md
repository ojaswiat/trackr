# trackr. - Personal Finance Tracker

A full-stack personal finance tracker built with Nuxt 4 (Vue 3), TypeScript, PostgreSQL and Drizzle ORM. Track expenses, manage multiple accounts and visualise your spending with charts and filters.

**Live demo:** https://trackr-murex-sigma.vercel.app (use "Sign in as Demo User" for a read-only tour)

> **Project status:** trackr. is a personal portfolio project. It works end to end (authentication, accounts, transactions, dashboard), but it has no automated test suite and has not had a security review. See [Known Limitations](#known-limitations) before relying on it for anything important.

---

## 📋 Table of Contents

- [User Manual](#user-manual)
    - [Getting Started](#getting-started)
    - [Features Overview](#features-overview)
    - [Managing Accounts](#managing-accounts)
    - [Recording Transactions](#recording-transactions)
    - [Dashboard & Analytics](#dashboard--analytics)
    - [Transactions Page](#transactions-page)
    - [Profile Settings](#profile-settings)
    - [FAQ](#faq)
- [Developer Notes](#developer-notes)
    - [Tech Stack](#tech-stack)
    - [Project Structure](#project-structure)
    - [Getting Started (Development)](#getting-started-development)
    - [Environment Setup](#environment-setup)
    - [Database Setup](#database-setup)
    - [Development Workflow](#development-workflow)
    - [API Architecture](#api-architecture)
    - [Key Conventions](#key-conventions)
    - [Deployment](#deployment)
- [Contributing](#contributing)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Support](#support)

---

# User Manual

## Getting Started

### Sign In Options

trackr. offers two ways to get started:

1. **Demo Account** - View a read-only demo account with sample data
    - Click "Sign in as Demo User" on the sign-in page
    - Explore the dashboard, accounts and transactions without creating an account
    - Creating, editing and deleting are blocked for the demo user, and the block is enforced on the server
    - The demo data covers **1 December 2025 to 15 January 2026**. The dashboard opens on the last three months, so set the date range to that window to see the sample data

2. **Create Your Account** - Full access with your own data
    - Sign in with GitHub
    - Google sign-in is only available to approved test users, so use GitHub if Google is not available to you
    - Your data is stored under your own account, and every request is scoped to the signed-in user (see [Is my financial data secure?](#is-my-financial-data-secure))

### First-Time Setup

After signing in for the first time:

1. Navigate to **Profile** to set your preferred currency
2. Go to **Accounts** to create your first account
3. Start adding transactions from the **Dashboard** or **Transactions** page

---

## Features Overview

### 🎯 Key Features

- **Multiple Accounts** - Manage up to 5 accounts (savings, checking, credit cards, etc.)
- **Transaction Tracking** - Record income and expenses with categories
- **Visual Analytics** - Charts for spending by category and income versus expense per account
- **Date Filtering** - Analyse finances over a custom date range (default: last 3 months)
- **Multi-Currency Display** - Choose from 12 currencies: INR, USD, EUR, GBP, JPY, CNY, AUD, CAD, CHF, HKD, SGD, NZD. The currency setting changes how amounts are displayed; it does not convert between currencies
- **Sign-in Options** - GitHub, Google (test users only) and a read-only demo account
- **Responsive Layout** - Built with Nuxt UI and Tailwind CSS. The mobile layout is still being refined

---

## Managing Accounts

### Creating an Account

1. Navigate to **Accounts** page
2. Click **"Add Account"** button
3. Fill in the details:
    - **Account Name** (e.g., "Main Checking", "Savings", maximum 30 characters)
    - **Initial Balance** - Starting amount for the account. It is stored on the account and included in the balance; it is not recorded as a transaction
    - **Color** - Choose a color for easy identification
    - **Description** (optional, maximum 60 characters)
4. Click **"Add"** to save

**Note:** You can create up to 5 accounts.

### Editing an Account

1. Select an account from the Accounts page
2. Click the **pencil icon** (Edit)
3. Update details (Note: Initial balance cannot be changed)
4. Click **"Update"** to save changes

### Deleting an Account

1. Select the account you want to delete
2. Click the **trash icon** (Delete)
3. Choose whether to keep associated transactions
    - **Keep transactions** - Transactions remain but are no longer linked to an account
    - **Delete transactions** - Permanently removes all transactions for the account
4. Confirm deletion

---

## Recording Transactions

### Adding a New Transaction

**From Dashboard:**

- Click **"New Transaction"** button in the sidebar

**From Transactions Page:**

- Same **"New Transaction"** button available

**Transaction Details:**

1. **Type** - Select Income or Expense
2. **Date** - When the transaction occurred
3. **Account** - Which account to link this to
4. **Category** - Select a category (required for expenses; income uses a single default category)
5. **Amount** - Transaction amount (must be greater than 0.00)
6. **Description** - Brief note about the transaction (maximum 60 characters)

**Action Buttons:**

- **Add** - Save and close the form
- **Save** - Save and add another transaction immediately

### Editing a Transaction

1. Go to **Transactions** page
2. Find the transaction in the table
3. Click the **⋮** (three dots) menu
4. Select **"Edit"**
5. Update details and click **"Save"**

### Deleting a Transaction

1. Find the transaction in the table
2. Click the **⋮** (three dots) menu
3. Select **"Delete"**
4. Confirm deletion

---

## Dashboard & Analytics

### Dashboard Overview

The dashboard gives an overview of your finances for the selected period:

**Summary Cards:**

- **Total Income** - All income in the selected period
- **Total Expense** - All spending in the selected period
- **Net Balance** - Income minus expenses

**Accounts Section:**

- View all accounts with current balances
- Click an account to filter dashboard data
- See account-specific income and expense breakdown

**Charts:**

1. **Spending by Category** (Donut Chart)
    - Breakdown of expense categories for the period

2. **Accounts Summary** (Bar Chart)
    - Compare income and expenses across accounts

3. **Recent Transactions**
    - Last 5 transactions across all accounts

### Filtering Dashboard Data

Use the filter controls at the top:

1. **Account Filter** - View a specific account or all accounts
2. **Date Range Picker** - Select a custom start and end date (the earliest selectable date is one year back)
3. **Reset** - Clear all filters and return to defaults
4. **Refresh** - Reload dashboard data

**Default Date Range:** Last 3 months

---

## Transactions Page

### Viewing Transactions

The transactions page shows a table with:

- Transaction date
- Category (color coded)
- Account (color coded)
- Description
- Amount (green for income, red for expenses)

### Filtering Transactions

**Available Filters:**

- **Type** - Income or Expense
- **Category** - Specific expense category
- **Account** - Specific account
- **Date Range** - Custom date picker

### Infinite Scroll

- Transactions load 20 at a time using cursor-based pagination
- Scroll to the bottom to load more

---

## Profile Settings

### Updating Profile

Navigate to **Profile** page to update:

1. **First Name**
2. **Last Name**
3. **Currency** - Choose from the 12 supported currencies

Click **"Save Changes"** to update your profile.

**Note:** Email address cannot be changed.

### Deleting Your Account

**⚠️ Warning:** This action is irreversible!

1. Navigate to **Profile** page
2. Scroll to the **"Danger Zone"** section
3. Click **"Delete Account"**
4. Confirm deletion

This permanently deletes your user record, all your accounts and all your transactions (the database cascades the deletion).

---

## FAQ

### How many accounts can I create?

Up to **5 accounts**. The limit is enforced by the API when an account is added.

### Can I change my currency?

Yes. Go to the **Profile** page and pick a currency from the dropdown. This changes how amounts are formatted throughout the app. Amounts are not converted.

### What happens to my transactions if I delete an account?

You are asked whether to keep the transactions:

- **Keep them** - Transactions remain but are no longer linked to an account
- **Delete them** - All of the account's transactions are permanently removed

### How do I filter transactions by date?

Use the date picker in the filters section:

1. Click the calendar icon
2. Select start and end dates
3. Data updates automatically

### Is my financial data secure?

trackr. is a portfolio project and has not been through a security review, so treat it accordingly. What it does:

- Authentication is handled by Supabase Auth (GitHub sign-in, plus Google for test users)
- Protected API routes require a signed-in user
- Database queries are scoped to the signed-in user's ID
- Request bodies are validated with Zod
- The demo account is read-only, and write requests from it are rejected on the server

What it does not have: an independent security audit or automated tests. Hosting providers (for example Vercel and your database host) have their own policies, and the app includes the Vercel Analytics package. Do not rely on trackr. as the only record of your finances.

### Can I export my data?

Not currently. Export may be added in a future update.

### What categories are available?

trackr. uses pre-defined categories stored in the database, for example Food, Shopping, Rent, Bills, Utilities, Commute, Travel and Fees. Income has a single default category. You cannot add custom categories yet.

---

# Developer Notes

## Tech Stack

### Frontend

- **Framework:** Nuxt 4 (Vue 3 + Nitro server)
- **Language:** TypeScript
- **UI Library:** Nuxt UI 4 (Tailwind CSS)
- **State Management:** Pinia
- **Validation:** Zod
- **Icons:** Lucide (via Iconify)
- **Charts:** Nuxt Charts (Unovis)

### Backend

- **Runtime:** Nitro (Nuxt server routes)
- **Database:** PostgreSQL via the `postgres` driver
- **ORM:** Drizzle ORM (1.0 beta release)
- **Authentication:** Supabase Auth (`@nuxtjs/supabase`)

### DevOps

- **Package Manager:** pnpm
- **Linting:** ESLint (`@antfu/eslint-config`)
- **Type Checking:** TypeScript + vue-tsc (`nuxt typecheck`)
- **CI:** GitHub Actions run lint and typecheck on every push
- **Keep-alive:** A scheduled GitHub Actions job calls `GET /api/health` every 6 days, which runs a `SELECT 1` so the hosted database does not pause from inactivity
- **Dependency updates:** Renovate (config included)
- **Hosting:** Vercel

---

## Project Structure

```
trackr/
├── app/                      # Frontend application
│   ├── assets/css/          # Global styles
│   ├── components/          # Vue components (accounts, transactions, dashboard, charts, forms, UI shell)
│   ├── composables/         # Composables (e.g. useTransactionActions)
│   ├── constants/           # Frontend constants (routes, UI)
│   ├── layouts/             # Application layouts
│   ├── middleware/          # Client-side route middleware
│   ├── pages/               # Route pages
│   ├── stores/              # Pinia stores
│   ├── types/               # Frontend types
│   └── utils/               # Formatting and UI helpers
├── server/                  # Backend application
│   ├── api/                 # API route handlers (accounts, transactions, dashboard, categories, user, auth, health)
│   ├── handlers/            # Business logic and database access
│   ├── middleware/          # Auth and demo-user guards
│   ├── utils/               # Database client and API helpers
│   └── constants/           # Server constants
├── shared/                  # Code shared by app and server
│   ├── db/                  # Drizzle schema
│   ├── schemas/             # Zod validation schemas
│   ├── types/               # Shared types
│   └── constants/           # Shared constants (config, enums, API paths)
├── data/                    # Static data (currencies)
├── public/                  # Static files
├── .github/workflows/       # CI and keep-alive workflows
└── drizzle.config.ts        # Drizzle Kit configuration
```

---

## Getting Started (Development)

### Prerequisites

- **Node.js:** v22 or higher
- **pnpm:** v10.27.0 or higher
- **PostgreSQL:** v14 or higher
- **Supabase Account:** For authentication

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/ojaswiat/trackr.git
    cd trackr
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    ```

3. **Set up environment variables:**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment variables** (see [Environment Setup](#environment-setup))

5. **Set up the database** (see [Database Setup](#database-setup))

6. **Run development server:**

    ```bash
    pnpm dev
    ```

7. **Access the application:**
    - Open http://localhost:3000 in your browser

---

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trackr"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-publishable-key"

# Demo Account (Optional - the demo user's data must be seeded in the database)
DEMO_ACCOUNT_EMAIL="demo@example.com"
DEMO_ACCOUNT_PASSWORD="your-demo-password"
```

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable authentication providers:
    - GitHub OAuth
    - Google OAuth (optional; limited to test users while the OAuth app is in testing mode)
3. Get your project URL and publishable key from the project settings
4. Configure redirect URLs:
    - Add `http://localhost:3000/confirm` for development
    - Add your production URL + `/confirm` for production

---

## Database Setup

### 1. Create PostgreSQL Database

```bash
createdb trackr
```

### 2. Apply the Schema

No migration files are committed to the repository, so use `db:push` to apply the Drizzle schema directly:

```bash
pnpm db:push
```

`pnpm db:generate` and `pnpm db:migrate` are available if you want to maintain migration files yourself.

### 3. Seed Categories (Manual)

Insert the categories you want into the `categories` table. `type` is `0` for income and `1` for expense. The statement below is an example set; adjust the names and colors to your needs:

```sql
INSERT INTO categories (name, description, type, color) VALUES
  ('Income', 'All income transactions', 0, '#10b981'),
  ('Food & Dining', 'Groceries, restaurants, etc.', 1, '#ef4444'),
  ('Transportation', 'Gas, public transport, etc.', 1, '#f59e0b'),
  ('Shopping', 'Clothing, electronics, etc.', 1, '#8b5cf6'),
  ('Entertainment', 'Movies, games, hobbies', 1, '#ec4899'),
  ('Bills & Utilities', 'Rent, electricity, internet', 1, '#6366f1'),
  ('Healthcare', 'Medical, insurance', 1, '#14b8a6'),
  ('Education', 'Courses, books', 1, '#f97316'),
  ('Other', 'Miscellaneous expenses', 1, '#64748b');
```

---

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (with Node inspector)
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking (nuxt typecheck)

# Database
pnpm db:generate      # Generate migrations from schema
pnpm db:push          # Push schema changes directly to the database
pnpm db:migrate       # Apply generated migrations

# Cleanup
pnpm clean            # Remove build artifacts
pnpm clean:all        # Remove node_modules and lockfile
pnpm reset            # Clean and re-prepare
pnpm reset:all        # Full clean and reinstall
```

### Development Best Practices

1. **Run type checking before committing** (CI also runs it):

    ```bash
    pnpm typecheck
    ```

2. **Follow the ESLint rules** (CI also runs this):

    ```bash
    pnpm lint
    ```

3. **Test API changes manually.** There is no automated test suite yet, and CI covers lint and typecheck only

4. **Use appropriate HTTP status codes:**
    - 200: Success
    - 201: Created
    - 400: Bad Request (validation failed)
    - 401: Unauthorized
    - 403: Forbidden (permission denied)
    - 404: Not Found
    - 500: Internal Server Error

---

## API Architecture

### Request Pipeline

1. **Auth middleware** (`server/middleware/01.auth.ts`) - For protected routes, asks Supabase for the current user and rejects the request with 401 if there is none
2. **Demo guard** (`server/middleware/02.is-demo.ts`) - Rejects account, transaction and profile writes from the demo user with 403
3. **Route handler** - Validates the input, calls a handler function, returns a structured response

### 3-Layer Architecture

Every API endpoint follows this pattern:

**1. Shared Schema** (`shared/schemas/zod.schema.ts`)

- Define Zod validation schemas
- Use `z.coerce.number()` for numeric inputs
- Example: `ZAddAccountSchema`

**2. Handler** (`server/handlers/*.handler.ts`)

- Functions for database operations, scoped to a user ID
- No HTTP errors thrown
- Separate "check" and "action" functions
- Explicit return types
- Example: `addAccountForUser(userId, data): Promise<TAccount>`

**3. API Route** (`server/api/**/*.ts`)

- Validate input with Zod
- Call handlers for business logic
- Return structured responses
- Handle errors with try/catch

### Example API Flow (abridged)

```typescript
// 1. Shared Schema
export const ZAddAccountSchema = z.object({
    name: z.string().min(1).max(30),
    initial_balance: z.coerce.number(),
    color: z.string().min(1),
    description: z.string().max(60).optional(),
});

// 2. Handler
export async function checkCanUserAddAccount(userId: string): Promise<boolean> {
    // counts the user's accounts and compares with APP_CONFIG.MAX_ACCOUNTS_PER_USER
}

export async function addAccountForUser(userId: string, payload: TAddAccountPayload): Promise<TAccount> {
    // inserts the account and returns it with zeroed income/expense totals
}

// 3. API Route
export default defineEventHandler(async (event) => {
    const user = event.context.user as TUser;
    const body = await readBody(event);

    // Validate
    const result = ZAddAccountSchema.safeParse(body);
    if (!result.success) {
        throw createError({ statusCode: 400, message: "Invalid input", data: result.error.issues });
    }

    // Check the account limit
    if (!(await checkCanUserAddAccount(user.id))) {
        throw createError({ statusCode: 400, message: "User can only have 5 accounts!" });
    }

    // Execute and return
    const newAccount = await addAccountForUser(user.id, result.data);

    return {
        statusCode: 201,
        statusMessage: "Created",
        message: "Account created successfully!",
        data: { account: newAccount },
    };
});
```

### API Response Format

**Success Response:**

```typescript
{
    statusCode: number;
    statusMessage: string;
    message: string;
    data: T;
}
```

**Error Response:**

```typescript
{
    statusCode: number;
    statusMessage: string;
    message: string;
    data?: any; // Validation errors, when present
}
```

### Health Check

`GET /api/health` runs a `SELECT 1` against the database and returns 200 when it succeeds. The scheduled keep-alive workflow uses it.

---

## Key Conventions

### File Naming

- **Components:** PascalCase (e.g., `AccountCard.vue`)
- **Pages:** lowercase (e.g., `dashboard.vue`)
- **Stores:** PascalCase with "Store" suffix (e.g., `UserStore.ts`)
- **API Routes:** HTTP method suffix (e.g., `add.post.ts`, `fetch.get.ts`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `ROUTE_DASHBOARD`)

### Import Paths

- Use constants for routes: `ROUTE_DASHBOARD` instead of `"/dashboard"`
- Use constants for API endpoints: `ACCOUNTS_FETCH` instead of `"/api/accounts/fetch"`
- Import from `~~/shared` for shared code

### Type Conventions

- Prefix types with `T`: `TUser`, `TAccount`, `TTransaction`
- Use Zod schemas for validation
- Define explicit return types for handlers

### Database Conventions

- Use `numeric(precision, scale)` for money fields (not floats)
- Use UUIDs for primary keys
- Cascade deletes where appropriate (deleting a user removes their accounts and transactions; deleting an account can keep its transactions)
- Add indexes on foreign keys and frequently queried columns

### Component Conventions

- Use `defineProps` with TypeScript
- Use `defineEmits` for events
- Use `v-model` for two-way binding
- Use Nuxt UI components consistently

---

## Deployment

The live demo is deployed on Vercel, with PostgreSQL reached through `DATABASE_URL` and authentication through Supabase.

### Environment Variables (Production)

Set these in your hosting provider:

```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_KEY="..."
DEMO_ACCOUNT_EMAIL="..."      # optional
DEMO_ACCOUNT_PASSWORD="..."   # optional
```

### Build and Deploy

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

Other hosts supported by Nitro (for example Netlify or Railway) should work, but only Vercel has been used for this project.

### Post-Deployment Checklist

1. ✅ Apply the database schema (`pnpm db:push` or `pnpm db:migrate`)
2. ✅ Seed the categories table
3. ✅ Configure Supabase redirect URLs (`/confirm`)
4. ✅ Test the sign-in flows
5. ✅ Verify the API endpoints and `GET /api/health`
6. ✅ Test the demo account (if enabled)

---

## Contributing

This is a personal portfolio project. Issues and suggestions are welcome.

1. Fork the repository and create a feature branch
2. Make your changes
3. Run `pnpm typecheck` and `pnpm lint` (CI runs both on every push)
4. Open a pull request describing the change

---

## Known Limitations

- **Maximum 5 accounts per user** - Enforced in the API handler. The schema contains a note to add a database-level trigger, which is not implemented
- **Demo user is read-only** - Account, transaction and profile writes are rejected on the server
- **Demo data window** - The demo account's sample data covers 1 December 2025 to 15 January 2026, while the dashboard defaults to the last 3 months
- **No data export** - Planned for a future release
- **Categories are pre-defined** - Custom categories are not supported
- **Individual accounts only** - No shared or household accounts
- **No automated tests** - CI runs lint and typecheck only
- **Mobile layout is still being refined**
- **Drizzle ORM is a beta release**
- **Google sign-in is limited to approved test users**
- **No security review has been done** - See [Is my financial data secure?](#is-my-financial-data-secure)

---

## Troubleshooting

### Common Issues

**Database connection errors:**

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check the database exists

**Supabase authentication errors:**

- Verify `SUPABASE_URL` and `SUPABASE_KEY`
- Check the OAuth provider configuration
- Ensure redirect URLs are set correctly

**Demo sign-in fails:**

- Check `DEMO_ACCOUNT_EMAIL` and `DEMO_ACCOUNT_PASSWORD`
- Make sure the demo user exists in Supabase Auth and its data is seeded in the database

**Dashboard shows zero for the demo account:**

- Set the date range to 1 December 2025 to 15 January 2026

**Type errors:**

- Run `pnpm typecheck` to identify issues
- Ensure the Drizzle schema matches the database

**Build errors:**

- Clear the cache: `pnpm clean`
- Reinstall dependencies: `pnpm clean:all && pnpm install`

---

## License

MIT License - See [LICENSE](LICENSE) file for details

---

## Support

For issues and questions:

- Check existing GitHub issues
- Create a new issue with a detailed description
- Include error logs and environment details

---

**Ojaswi Athghara**
