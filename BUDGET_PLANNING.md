# Monthly Budget Planning Feature

A comprehensive monthly budget planning system integrated with Supabase for tracking income and expenses month by month.

## Overview

This feature allows you to:

- Plan your monthly budget with pre-defined categories
- Track actual amounts against planned amounts
- See what's pending/remaining for each category
- Add custom categories as needed
- Visualize your budget with interactive charts
- Compare months across a year

## Pre-loaded Categories

### Income

- Salary Received

### Expenses

- Home EMI
- Expenses
- SWE
- Credit Card Bill
- Credit Card EMI
- Savings

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/budget-planning-migration.sql`
4. Copy all the SQL code
5. Paste and execute in Supabase SQL Editor

This will create:

- `budget_categories` table with default categories
- `monthly_budgets` table for tracking
- Indexes for performance
- RLS policies for security
- Helper functions for summaries

### Step 2: Access the Feature

1. Visit your deployed app or run locally
2. Click on **Planning** tab in navigation
3. Start using the feature!

## How to Use

### Initialize a Month

1. Select Year and Month from dropdowns
2. Click **Initialize Month** button
3. All categories will be added with 0 amounts

### Copy from Previous Month

1. Select the target month
2. Click **Copy from Previous**
3. Planned amounts from previous month will be copied
4. Actual amounts will be reset to 0

### Enter Budget Data

1. Click the **Edit** icon (✏️) on any row
2. Enter:
   - **Planned Amount**: What you expect/budget
   - **Actual Amount**: What actually happened
3. Click the **Check** icon (✓) to save
4. Or **X** to cancel

### Add Custom Category

1. Click **Add Category** button (top right)
2. Enter category name (e.g., "Savings 2", "Investment")
3. Select type: Income or Expense
4. Click **Add Category**
5. The category will appear in your budget table

### View Charts

1. Click **Charts** tab
2. View three chart types:
   - **Income vs Expenses**: Monthly comparison
   - **Planned vs Actual**: How well you stuck to plan
   - **Savings Trend**: Track savings over time

## Features in Detail

### Summary Cards

**Total Income**

- Sum of all income (actual amounts)
- Shown in green

**Total Expenses**

- Sum of all expense categories (actual)
- Shows planned amount below
- Shown in red

**Net Savings**

- Income minus Expenses
- Shows as % of income
- Green if positive, red if negative

**Planned vs Actual**

- Percentage of planned expenses actually spent
- Helps track budget adherence

### Budget Table

**Columns:**

- **Category**: Name and type (income/expense)
- **Planned**: Budgeted amount
- **Actual**: Real amount
- **Pending**: Difference (Planned - Actual)
- **Actions**: Edit button

**Color Coding:**

- Orange = Amount pending
- Green = Completed/settled

**Sections:**

- Income section (green header)
- Expenses section (red header)

### Charts

**Income vs Expenses**

- Bar chart showing monthly totals
- Green bars = Income
- Red bars = Expenses
- Compares across all months in year

**Planned vs Actual**

- Side-by-side comparison
- Blue = Planned expenses
- Purple = Actual expenses
- See if you're over/under budget

**Savings Trend**

- Line chart over time
- Blue line = Planned savings
- Green line = Actual savings
- Track savings performance

## Use Cases

### Personal Budget Management

Track salary, EMIs, credit cards, and savings month by month.

### Financial Planning

Plan ahead by setting budgets and comparing with actuals.

### Expense Control

See where you're overspending and adjust accordingly.

### Savings Tracking

Monitor if you're meeting savings goals.

## Data Storage

- **Database**: Supabase PostgreSQL
- **Persistence**: All data stored in cloud
- **Access**: Available from any device
- **Backup**: Managed by Supabase

## Key Differences from Other Features

| Feature      | Storage      | Purpose                     |
| ------------ | ------------ | --------------------------- |
| **Expenses** | Supabase     | Day-to-day expense tracking |
| **Budgets**  | Supabase     | Category spending limits    |
| **Split**    | localStorage | Split bills with friends    |
| **Planning** | Supabase     | Monthly budget planning     |

## Tips

### 💡 Best Practices

1. **Initialize Early**: Set up next month's budget at month-end
2. **Copy Regularly**: Use "Copy from Previous" for consistent categories
3. **Update Weekly**: Update actual amounts weekly for accuracy
4. **Review Monthly**: Check charts at month-end for insights
5. **Adjust Plans**: Update planned amounts based on actual trends

### 📊 Using Charts Effectively

- **Track Trends**: Look for patterns in income vs expenses
- **Compare Months**: Identify high-spending months
- **Monitor Savings**: Ensure consistent savings
- **Budget Adherence**: Keep planned vs actual close

### ⚠️ Common Scenarios

**Scenario**: Forgot to enter data for a month

- **Solution**: Click "Initialize Month" then enter all amounts at once

**Scenario**: Need a new category mid-year

- **Solution**: Add category, it will only appear from current month forward

**Scenario**: Want to track investments separately

- **Solution**: Add custom categories like "Savings 2", "Investment Fund"

## Database Schema

### budget_categories

```sql
- id: UUID (primary key)
- name: TEXT (category name)
- type: TEXT (income/expense)
- is_default: BOOLEAN (pre-loaded or custom)
- display_order: INTEGER (sort order)
- created_at: TIMESTAMP
```

### monthly_budgets

```sql
- id: UUID (primary key)
- year: INTEGER
- month: INTEGER (1-12)
- category_id: UUID (foreign key)
- planned_amount: DECIMAL(10,2)
- actual_amount: DECIMAL(10,2)
- notes: TEXT (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(year, month, category_id)
```

## API Operations

All operations are in `lib/budget-planning-operations.ts`:

```typescript
// Categories
budgetCategoryOperations.getAll();
budgetCategoryOperations.create(category);
budgetCategoryOperations.update(id, data);
budgetCategoryOperations.delete(id);

// Monthly Budgets
monthlyBudgetOperations.getByMonth(year, month);
monthlyBudgetOperations.getByYear(year);
monthlyBudgetOperations.upsert(budget);
monthlyBudgetOperations.update(id, data);
monthlyBudgetOperations.delete(id);
monthlyBudgetOperations.getSummary(year, month);
monthlyBudgetOperations.getYearSummary(year);
monthlyBudgetOperations.initializeMonth(year, month);
monthlyBudgetOperations.copyFromPreviousMonth(year, month);
```

## Troubleshooting

### Categories not showing

- Run the migration SQL in Supabase
- Check if tables exist in Supabase Table Editor

### Can't edit amounts

- Check Supabase connection
- Verify RLS policies are enabled
- Check browser console for errors

### Charts not loading

- Ensure data exists for the year
- Check year filter is correct
- Refresh the page

## Future Enhancements

Potential additions:

- Export to CSV/Excel
- Budget templates
- Recurring budget rules
- Email notifications for overspending
- Multi-currency support
- Budget comparisons (year-over-year)
- Goal tracking
- Receipt attachments

## Support

For issues:

1. Check Supabase connection
2. Verify migration was run
3. Check browser console for errors
4. Review Supabase logs

---

**Enjoy better financial planning!** 💰📊
