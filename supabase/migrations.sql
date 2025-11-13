-- Personal Expense Tracker Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  budget_limit DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly', 'weekly', 'yearly')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);

-- Insert default categories
INSERT INTO categories (name, icon, color) VALUES
  ('Food', 'utensils', '#EF4444'),
  ('Transport', 'car', '#3B82F6'),
  ('Entertainment', 'tv', '#8B5CF6'),
  ('Bills', 'file-text', '#F59E0B'),
  ('Shopping', 'shopping-bag', '#EC4899'),
  ('Health', 'heart-pulse', '#10B981'),
  ('Education', 'book-open', '#6366F1'),
  ('Grocery', 'shopping-cart', '#22C55E'),
  ('Other', 'more-horizontal', '#6B7280')
ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS) for demo mode
-- These policies allow all operations (since this is single-user demo mode)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for expenses
CREATE POLICY "Allow all operations on expenses" ON expenses
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for budgets
CREATE POLICY "Allow all operations on budgets" ON budgets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to get expense summary
CREATE OR REPLACE FUNCTION get_expense_summary(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_amount DECIMAL,
  expense_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(amount), 0) as total_amount,
    COUNT(*) as expense_count
  FROM expenses
  WHERE date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get category breakdown
CREATE OR REPLACE FUNCTION get_category_breakdown(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_icon TEXT,
  category_color TEXT,
  total_amount DECIMAL,
  expense_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    COALESCE(SUM(e.amount), 0) as total_amount,
    COUNT(e.id) as expense_count
  FROM categories c
  LEFT JOIN expenses e ON c.id = e.category_id 
    AND e.date BETWEEN start_date AND end_date
  GROUP BY c.id, c.name, c.icon, c.color
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

