import { supabase } from './supabase';
import type { BudgetCategory, MonthlyBudget, MonthlyBudgetSummary } from './budget-planning-types';

// Budget Category operations
export const budgetCategoryOperations = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('budget_categories')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as BudgetCategory[];
  },

  // Create a new category
  async create(category: Omit<BudgetCategory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('budget_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data as BudgetCategory;
  },

  // Update a category
  async update(id: string, category: Partial<BudgetCategory>) {
    const { data, error } = await supabase
      .from('budget_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as BudgetCategory;
  },

  // Delete a category
  async delete(id: string) {
    const { error } = await supabase
      .from('budget_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Monthly Budget operations
export const monthlyBudgetOperations = {
  // Get budgets for a specific month
  async getByMonth(year: number, month: number) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .select(`
        *,
        category:budget_categories(*)
      `)
      .eq('year', year)
      .eq('month', month);
    
    if (error) throw error;
    
    // Sort by category display_order client-side
    const sorted = (data as (MonthlyBudget & { category: BudgetCategory })[])
      .sort((a, b) => (a.category?.display_order || 0) - (b.category?.display_order || 0));
    
    return sorted;
  },

  // Get budgets for a year
  async getByYear(year: number) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .select(`
        *,
        category:budget_categories(*)
      `)
      .eq('year', year)
      .order('month', { ascending: true });
    
    if (error) throw error;
    return data as (MonthlyBudget & { category: BudgetCategory })[];
  },

  // Create or update a budget entry
  async upsert(budget: {
    year: number;
    month: number;
    category_id: string;
    planned_amount: number;
    actual_amount: number;
    notes?: string;
  }) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .upsert(budget, {
        onConflict: 'year,month,category_id',
      })
      .select(`
        *,
        category:budget_categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as MonthlyBudget & { category: BudgetCategory };
  },

  // Update a budget entry
  async update(id: string, updates: Partial<MonthlyBudget>) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:budget_categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as MonthlyBudget & { category: BudgetCategory };
  },

  // Delete a budget entry
  async delete(id: string) {
    const { error } = await supabase
      .from('monthly_budgets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get monthly summary
  async getSummary(year: number, month: number): Promise<MonthlyBudgetSummary> {
    const { data, error } = await supabase
      .rpc('get_monthly_budget_summary', {
        p_year: year,
        p_month: month,
      });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        total_income: 0,
        total_expenses_planned: 0,
        total_expenses_actual: 0,
        savings_planned: 0,
        savings_actual: 0,
      };
    }

    return data[0] as MonthlyBudgetSummary;
  },

  // Get year summary (all months)
  async getYearSummary(year: number) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const summaries = await Promise.all(
      months.map(month => this.getSummary(year, month))
    );

    return months.map((month, index) => ({
      month,
      ...summaries[index],
    }));
  },

  // Initialize month with categories
  async initializeMonth(year: number, month: number) {
    const categories = await budgetCategoryOperations.getAll();
    
    const budgets = categories.map(category => ({
      year,
      month,
      category_id: category.id,
      planned_amount: 0,
      actual_amount: 0,
    }));

    const { data, error } = await supabase
      .from('monthly_budgets')
      .upsert(budgets, {
        onConflict: 'year,month,category_id',
        ignoreDuplicates: true,
      })
      .select(`
        *,
        category:budget_categories(*)
      `);
    
    if (error) throw error;
    return data as (MonthlyBudget & { category: BudgetCategory })[];
  },

  // Copy previous month's planned amounts
  async copyFromPreviousMonth(year: number, month: number) {
    let prevYear = year;
    let prevMonth = month - 1;
    
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }

    const prevBudgets = await this.getByMonth(prevYear, prevMonth);
    
    const newBudgets = prevBudgets.map(budget => ({
      year,
      month,
      category_id: budget.category_id,
      planned_amount: budget.planned_amount,
      actual_amount: 0,
      notes: null,
    }));

    const { data, error } = await supabase
      .from('monthly_budgets')
      .upsert(newBudgets, {
        onConflict: 'year,month,category_id',
      })
      .select(`
        *,
        category:budget_categories(*)
      `);
    
    if (error) throw error;
    return data as (MonthlyBudget & { category: BudgetCategory })[];
  },
};

