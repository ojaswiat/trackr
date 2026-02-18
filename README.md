# trackr. - Personal Finance Tracker

A modern, full-stack personal finance tracking application built with Nuxt 3, TypeScript, PostgreSQL, and Drizzle ORM. Track expenses, manage multiple accounts, and visualize your financial health with interactive charts and insights.

---

## 📋 Table of Contents

- [User Manual](#user-manual)
    - [Getting Started](#getting-started)
    - [Features Overview](#features-overview)
    - [Managing Accounts](#managing-accounts)
    - [Recording Transactions](#recording-transactions)
    - [Dashboard & Analytics](#dashboard--analytics)
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

---

# User Manual

## Getting Started

### Sign In Options

trackr. offers two ways to get started:

1. **Demo Account** - View a read-only demo account with sample data
    - Click "Sign in as Demo User" on the sign-in page
    - Explore features without creating an account
    - Note: Cannot create, edit, or delete data in demo mode

2. **Create Your Account** - Full access with personal data
    - Sign in with GitHub or Google
    - Start tracking your finances immediately
    - All data is private and secure

### First-Time Setup

After signing in for the first time:

1. Navigate to **Profile** to set your preferred currency
2. Go to **Accounts** to create your first account
3. Start adding transactions from the **Dashboard** or **Transactions** page

---

## Features Overview

### 🎯 Key Features

- **Multiple Accounts** - Manage up to 5 accounts (savings, checking, credit cards, etc.)
- **Transaction Tracking** - Record income and expenses with detailed categorization
- **Visual Analytics** - Interactive charts showing spending patterns and account summaries
- **Date Filtering** - Analyze finances over custom date ranges
- **Multi-Currency Support** - Choose from 12+ major currencies
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## Managing Accounts

### Creating an Account

1. Navigate to **Accounts** page
2. Click **"Add Account"** button
3. Fill in the details:
    - **Account Name** (e.g., "Main Checking", "Savings")
    - **Initial Balance** - Starting amount (counted as income)
    - **Color** - Choose a color for easy identification
    - **Description** (optional)
4. Click **"Add"** to save

**Note:** You can create up to 5 accounts maximum.

### Editing an Account

1. Select an account from the Accounts page
2. Click the **pencil icon** (Edit)
3. Update details (Note: Initial balance cannot be changed)
4. Click **"Update"** to save changes

### Deleting an Account

1. Select the account you want to delete
2. Click the **trash icon** (Delete)
3. Choose whether to keep associated transactions
    - **Keep transactions** - Transactions remain but unlinked from account
    - **Delete transactions** - Permanently removes all transactions
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
4. **Category** - Select category (required for expenses only)
5. **Amount** - Transaction amount
6. **Description** - Brief note about the transaction

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

The dashboard provides a comprehensive view of your finances:

**Summary Cards:**

- **Total Income** - All income in selected period
- **Total Expense** - All spending in selected period
- **Net Balance** - Income minus expenses

**Accounts Section:**

- View all accounts with current balances
- Click an account to filter dashboard data
- See account-specific income/expense breakdown

**Charts:**

1. **Spending by Category** (Donut Chart)
    - Visual breakdown of expense categories
    - Shows where your money goes

2. **Accounts Summary** (Bar Chart)
    - Compare income vs expenses across accounts
    - Identify which accounts have highest activity

3. **Recent Transactions**
    - Last 5 transactions across all accounts
    - Quick overview of recent activity

### Filtering Dashboard Data

Use the filter controls at the top:

1. **Account Filter** - View specific account or all accounts
2. **Date Range Picker** - Select custom start/end dates
3. **Reset** - Clear all filters and return to defaults
4. **Refresh** - Reload dashboard data

**Default Date Range:** Last 3 months

---

## Transactions Page

### Viewing Transactions

The transactions page shows a detailed table with:

- Transaction date
- Category (with color coding)
- Account (with color coding)
- Description
- Amount (color coded: green for income, red for expenses)

### Filtering Transactions

**Available Filters:**

- **Type** - Income or Expense
- **Category** - Specific expense category
- **Account** - Specific account
- **Date Range** - Custom date picker

### Infinite Scroll

- Transactions load 20 at a time
- Scroll to bottom to automatically load more
- Keeps interface fast and responsive

---

## Profile Settings

### Updating Profile

Navigate to **Profile** page to update:

1. **First Name**
2. **Last Name**
3. **Currency** - Choose from 12+ supported currencies

Click **"Save Changes"** to update your profile.

**Note:** Email address cannot be changed.

### Deleting Your Account

**⚠️ Warning:** This action is irreversible!

1. Navigate to **Profile** page
2. Scroll to the **"Danger Zone"** section
3. Click **"Delete Account"**
4. Confirm deletion

This will permanently delete:

- Your user account
- All accounts
- All transactions
- All data associated with your account

---

## FAQ

### How many accounts can I create?

You can create up to **5 accounts**. This limit helps keep your finances organized and manageable.

### Can I change my currency?

Yes! Go to **Profile** page and select your preferred currency from the dropdown. This updates how amounts are displayed throughout the app.

### What happens to my transactions if I delete an account?

When deleting an account, you'll be asked whether to keep transactions:

- **Keep them** - Transactions remain but aren't linked to any account
- **Delete them** - All transactions are permanently removed

### How do I filter transactions by date?

Use the date picker in the filters section:

1. Click the calendar icon
2. Select start and end dates
3. Data updates automatically

### Is my financial data secure?

Yes! Your data is:

- Secured with Supabase authentication
- Stored in an encrypted PostgreSQL database
- Never shared with third parties
- Protected by enterprise-grade security

### Can I export my data?

Currently, direct export is not available. This feature may be added in future updates.

### What categories are available?

trackr. comes with pre-defined expense categories such as:

- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- And more...

Income has a single default category.

---

# Developer Notes

## Tech Stack

### Frontend

- **Framework:** Nuxt 3 (Vue 3 + Nitro Server)
- **Language:** TypeScript
- **UI Library:** Nuxt UI (Tailwind CSS)
- **State Management:** Pinia
- **Validation:** Zod
- **Icons:** Lucide Icons
- **Charts:** Nuxt Charts (Unovis)

### Backend

- **Runtime:** Nitro (Nuxt server)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM (beta version)
- **Authentication:** Supabase Auth

### DevOps

- **Package Manager:** pnpm
- **Linting:** ESLint (@antfu/eslint-config)
- **Type Checking:** TypeScript + vue-tsc

---

## Project Structure

```
trackr/
├── app/                      # Frontend application
│   ├── assets/              # Static assets (CSS, data)
│   ├── components/          # Vue components
│   │   ├── charts/         # Chart components
│   │   ├── forms/          # Form components
│   │   └── ui/             # UI components
│   ├── layouts/            # Application layouts
│   ├── middleware/         # Client-side middleware
│   ├── pages/              # Route pages
│   ├── stores/             # Pinia stores
│   ├── types/              # Frontend types
│   ├── utils/              # Utility functions
│   └── constants/          # Frontend constants
├── server/                  # Backend application
│   ├── api/                # API route handlers
│   ├── handlers/           # Business logic layer
│   ├── middleware/         # Server middleware
│   ├── utils/              # Server utilities
│   └── constants/          # Server constants
├── shared/                  # Shared code
│   ├── db/                 # Database schema
│   ├── types/              # Shared types
│   ├── schemas/            # Zod validation schemas
│   └── constants/          # Shared constants
├── data/                    # Static data (currencies)
├── drizzle/                 # Database migrations
└── .vscode/                 # VSCode settings
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
    git clone <repository-url>
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
SUPABASE_KEY="your-anon-key"

# Demo Account (Optional)
DEMO_ACCOUNT_EMAIL="demo@example.com"
DEMO_ACCOUNT_PASSWORD="your-demo-password"

# Environment
NODE_ENV="development"
```

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable authentication providers:
    - GitHub OAuth
    - Google OAuth (for test users)
3. Get your project URL and anon key from project settings
4. Configure redirect URLs:
    - Add `http://localhost:3000/confirm` for development
    - Add your production URL + `/confirm` for production

---

## Database Setup

### 1. Create PostgreSQL Database

```bash
createdb trackr
```

### 2. Generate and Run Migrations

```bash
# Generate migration files from schema
pnpm db:generate

# Apply migrations to database
pnpm db:push
```

### 3. Seed Categories (Manual)

Insert default categories into the `categories` table:

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
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking

# Database
pnpm db:generate      # Generate migrations from schema
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Run migrations (production)

# Cleanup
pnpm clean            # Remove build artifacts
pnpm clean:all        # Remove node_modules and lockfile
pnpm reset            # Clean and reinstall
```

### Development Best Practices

1. **Always run type checking before committing:**

    ```bash
    pnpm typecheck
    ```

2. **Follow ESLint rules:**

    ```bash
    pnpm lint
    ```

3. **Test API changes manually** - No automated tests currently implemented

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

### 3-Layer Architecture

Every API endpoint follows this pattern:

**1. Shared Schema** (`shared/schemas/zod.schema.ts`)

- Define Zod validation schemas
- Use `z.coerce.number()` for numeric inputs
- Example: `ZAddAccountSchema`

**2. Handler** (`server/handlers/*.handler.ts`)

- Pure functions for database operations
- No HTTP errors thrown
- Separate "check" and "action" functions
- Explicit return types
- Example: `addAccountForUser(userId, data): Promise<TAccount>`

**3. API Route** (`server/api/**/*.ts`)

- Validate input with Zod
- Call handlers for business logic
- Return structured responses
- Handle errors with try/catch

### Example API Flow

```typescript
// 1. Shared Schema
export const ZAddAccountSchema = z.object({
    name: z.string().min(1).max(30),
    initial_balance: z.coerce.number().min(0),
    color: z.string(),
    description: z.string().max(60).optional(),
});

// 2. Handler
export async function addAccountForUser(
    userId: string,
    payload: { name: string; initial_balance: number; color: string; description?: string }
): Promise<TAccount> {
    const [newAccount] = await db.insert(accounts).values({
        name: payload.name,
        user_id: userId,
        initial_balance: String(payload.initial_balance),
        color: payload.color,
        description: payload.description || "",
    }).returning();

    return {
        id: newAccount.id,
        name: newAccount.name,
        description: newAccount.description,
        color: newAccount.color,
        initial_balance: Number(newAccount.initial_balance),
        total_income: 0,
        total_expense: 0,
    };
}

// 3. API Route
export default defineEventHandler(async (event) => {
    const user = event.context.user as TUser;
    const body = await readBody(event);

    // Validate
    const result = ZAddAccountSchema.safeParse(body);
    if (!result.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: result.error.issues,
        });
    }

    // Check permissions
    const canAdd = await checkCanUserAddAccount(user.id);
    if (!canAdd) {
        throw createError({
            statusCode: 400,
            message: "Maximum accounts limit reached",
        });
    }

    // Execute
    const newAccount = await addAccountForUser(user.id, result.data);

    // Return
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
    data: any; // Validation errors
}
```

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
- Use Zod schemas for validation, infer types from schemas
- Define explicit return types for handlers

### Database Conventions

- Use `numeric(precision, scale)` for money fields (not floats)
- Use UUIDs for primary keys
- Cascade deletes where appropriate
- Add indexes on foreign keys and frequently queried columns

### Component Conventions

- Use `defineProps` with TypeScript
- Use `defineEmits` for events
- Use `v-model` for two-way binding
- Use Nuxt UI components consistently

---

## Deployment

### Environment Variables (Production)

Ensure all required environment variables are set:

```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_KEY="..."
NODE_ENV="production"
```

### Build and Deploy

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Recommended Platforms

- **Vercel** - Zero-config deployment for Nuxt
- **Netlify** - Easy deployment with Git integration
- **Railway** - Supports PostgreSQL databases
- **Supabase** - Can host both database and authentication

### Post-Deployment Checklist

1. ✅ Run database migrations: `pnpm db:migrate`
2. ✅ Seed categories table
3. ✅ Configure Supabase redirect URLs
4. ✅ Test authentication flows
5. ✅ Verify API endpoints work
6. ✅ Test demo account (if enabled)

---

## Contributing

### Code Style

- Follow ESLint rules (@antfu/eslint-config)
- Use TypeScript strict mode
- Write meaningful commit messages
- Add comments for complex logic

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm typecheck` and `pnpm lint`
5. Submit a pull request with detailed description

---

## Known Limitations

- **Maximum 5 accounts per user** - Enforced by database trigger and handler
- **Demo users cannot create/edit/delete** - Read-only access
- **No data export feature** - Planned for future release
- **Categories are pre-defined** - Cannot add custom categories
- **No multi-user support** - Each account is individual

---

## Troubleshooting

### Common Issues

**Database connection errors:**

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database exists

**Supabase authentication errors:**

- Verify `SUPABASE_URL` and `SUPABASE_KEY`
- Check OAuth provider configuration
- Ensure redirect URLs are set correctly

**Type errors:**

- Run `pnpm typecheck` to identify issues
- Ensure Drizzle schema matches the database

**Build errors:**

- Clear cache: `pnpm clean`
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
