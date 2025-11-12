// Types for monthly budget planning feature

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  is_default: boolean;
  display_order: number;
  created_at: string;
}

export interface MonthlyBudget {
  id: string;
  year: number;
  month: number;
  category_id: string;
  planned_amount: number;
  actual_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  category?: BudgetCategory;
}

export interface MonthlyBudgetSummary {
  total_income: number;
  total_expenses_planned: number;
  total_expenses_actual: number;
  savings_planned: number;
  savings_actual: number;
}

export interface BudgetFormData {
  category_id: string;
  planned_amount: number;
  actual_amount: number;
  notes?: string;
}

export interface MonthYearFilter {
  year: number;
  month: number;
}

