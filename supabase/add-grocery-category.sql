-- Add Grocery category to existing budget planning database
-- Run this SQL in your Supabase SQL Editor

INSERT INTO budget_categories (name, type, is_default, display_order) VALUES
  ('Grocery', 'expense', true, 8)
ON CONFLICT DO NOTHING;

-- Verify the category was added
SELECT * FROM budget_categories WHERE name = 'Grocery';

