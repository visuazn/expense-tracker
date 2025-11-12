// Database types
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category_id: string;
  date: string;
  is_recurring: boolean;
  recurrence_pattern: 'daily' | 'weekly' | 'monthly' | null;
  created_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget_limit: number | null;
}

export interface Budget {
  id: string;
  category_id: string | null;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  start_date: string;
  category?: Category;
}

// Form types
export interface ExpenseFormData {
  amount: number;
  description: string;
  category_id: string;
  date: string;
  is_recurring: boolean;
  recurrence_pattern: 'daily' | 'weekly' | 'monthly' | null;
}

export interface BudgetFormData {
  category_id: string | null;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  start_date: string;
}

// Analytics types
export interface ExpenseSummary {
  total: number;
  monthlyAverage: number;
  categoryBreakdown: {
    category: Category;
    amount: number;
    percentage: number;
  }[];
}

export interface SpendingTrend {
  date: string;
  amount: number;
}

