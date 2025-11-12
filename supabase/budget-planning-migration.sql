-- Monthly Budget Planning Feature
-- Run this SQL in your Supabase SQL Editor

-- Create budget categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create monthly budgets table
CREATE TABLE IF NOT EXISTS monthly_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  category_id UUID NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  planned_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  actual_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, month, category_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_year_month ON monthly_budgets(year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_category_id ON monthly_budgets(category_id);

-- Enable RLS
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (demo mode - allow all)
CREATE POLICY "Allow all operations on budget_categories" ON budget_categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on monthly_budgets" ON monthly_budgets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default budget categories
INSERT INTO budget_categories (name, type, is_default, display_order) VALUES
  ('Salary Received', 'income', true, 1),
  ('Home EMI', 'expense', true, 2),
  ('Expenses', 'expense', true, 3),
  ('SWE', 'expense', true, 4),
  ('Credit Card Bill', 'expense', true, 5),
  ('Credit Card EMI', 'expense', true, 6),
  ('Savings', 'expense', true, 7)
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_monthly_budget_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_monthly_budgets_updated_at ON monthly_budgets;
CREATE TRIGGER update_monthly_budgets_updated_at
  BEFORE UPDATE ON monthly_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_monthly_budget_updated_at();

-- Function to get monthly summary
CREATE OR REPLACE FUNCTION get_monthly_budget_summary(
  p_year INTEGER,
  p_month INTEGER
)
RETURNS TABLE (
  total_income DECIMAL,
  total_expenses_planned DECIMAL,
  total_expenses_actual DECIMAL,
  savings_planned DECIMAL,
  savings_actual DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN bc.type = 'income' THEN mb.actual_amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN bc.type = 'expense' THEN mb.planned_amount ELSE 0 END), 0) as total_expenses_planned,
    COALESCE(SUM(CASE WHEN bc.type = 'expense' THEN mb.actual_amount ELSE 0 END), 0) as total_expenses_actual,
    COALESCE(SUM(CASE WHEN bc.type = 'income' THEN mb.planned_amount ELSE 0 END), 0) - 
      COALESCE(SUM(CASE WHEN bc.type = 'expense' THEN mb.planned_amount ELSE 0 END), 0) as savings_planned,
    COALESCE(SUM(CASE WHEN bc.type = 'income' THEN mb.actual_amount ELSE 0 END), 0) - 
      COALESCE(SUM(CASE WHEN bc.type = 'expense' THEN mb.actual_amount ELSE 0 END), 0) as savings_actual
  FROM monthly_budgets mb
  JOIN budget_categories bc ON mb.category_id = bc.id
  WHERE mb.year = p_year AND mb.month = p_month;
END;
$$ LANGUAGE plpgsql;

