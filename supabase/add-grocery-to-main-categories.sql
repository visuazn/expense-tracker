-- Add Grocery category to main expense tracker categories table
-- Run this SQL in your Supabase SQL Editor

INSERT INTO categories (name, icon, color) VALUES
  ('Grocery', 'shopping-cart', '#22C55E')
ON CONFLICT DO NOTHING;

-- Verify the category was added
SELECT * FROM categories WHERE name = 'Grocery';

