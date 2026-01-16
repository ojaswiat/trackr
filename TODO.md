- Create back-end APIs
    - Put the server side queries to handlers such that some page specific apis can be created such as /dashboard.get.ts.
    - Add server side middleware to API routes to check authentication status.
    - Add pagination to all the APIs.
    - Add Date range filter to all the APIs and use that to display the data on the dashboard.
- Integrate the back-end APIs with the front-end.
    - Move category and accounts to their store.
    - Toast for success and error messages
    - Limit the date range that can be selected to one month.
    - Add all accounts - the DB, APIs, and pagination will handle scaling issues. Sum or transactions, grouped by categories will fetch you the categories and the total amount spent on each category.
    - Implement refresh - accounts and categories.
- User CRUD
    - Add user profile page
    - Add user profile form update
    - Add user profile delete - delete all accounts and transactions associated with the user.
- Final touches
    - Add page titles using layout pageMeta
    - Add skeleton and loading states properly
    - Make the UI responsive
- Production
    - Create static pages - Landing, Privacy Policy, TOS
    - Deploy to Vercel
    - Get a domain name and logo (Picsart)
    - [Need brand verification for google login](https://console.cloud.google.com/auth/branding?authuser=1&project=trackr-nuxt-app)
    - Publish the app in Google Console

Further improvements - Already have 10 categories. No more categories allowed. See your apple notes.

Account transaction chart data

```SQL
SELECT
  a.id AS account_id,           -- Account ID from accounts table
  a.name AS account_name,       -- Account name (HSBC, Cash, etc.)
  DATE(t.transaction_date) AS date,  -- Truncate time → just YYYY-MM-DD
  t.transaction_type,           -- 0=income, 1=expense
  SUM(t.amount) AS total_amount -- Sum amounts per group
FROM transactions t             -- Main table (t = alias)
LEFT JOIN accounts a ON t.account_id = a.id  -- Join accounts for names
WHERE
  t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'  -- Last 30 days start
  AND t.transaction_type IN (0, 1)  -- Only income/expense (optional filter)
GROUP BY
  a.id, a.name, DATE(t.transaction_date), t.transaction_type  -- Group key
ORDER BY DATE(t.transaction_date) DESC;  -- Newest first
```

```JavaScript
db
  .select({                    // SELECT these columns
    account_id: accounts.id,
    account_name: accounts.name,
    date: sql`DATE(${transactions.transaction_date})`,  -- PostgreSQL DATE()
    transaction_type: transactions.transaction_type,
    total_amount: sum(transactions.amount)  -- SUM() aggregate
  })
  .from(transactions)          // FROM transactions
  .leftJoin(accounts, eq(transactions.account_id, accounts.id))  -- LEFT JOIN
  .where(                     // WHERE clause
    and(
      gte(transactions.transaction_date, thirtyDaysAgo()),  -- >= 30 days ago
      lt(transactions.transaction_date, new Date())         -- < today
    )
  )
  .groupBy(                    // GROUP BY (must match SELECT non-aggregates)
    accounts.id,
    accounts.name,
    sql`DATE(${transactions.transaction_date})`,
    transactions.transaction_type
  )
  .orderBy(sql`DATE(${transactions.transaction_date}) desc`)
```

Trigger to check number of accounts:

```SQL
CREATE OR REPLACE FUNCTION check_account_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM accounts WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'User can only have 5 accounts';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER account_limit_trigger
BEFORE INSERT ON accounts
FOR EACH ROW
EXECUTE FUNCTION check_account_limit();
```
