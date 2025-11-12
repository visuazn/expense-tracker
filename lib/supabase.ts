import { createClient } from '@supabase/supabase-js';
import type { Expense, Category, Budget } from './types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client if env vars are not set (for build time)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Expense operations
export const expenseOperations = {
  // Get all expenses
  async getAll() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as (Expense & { category: Category })[];
  },

  // Get expenses with filters
  async getFiltered(filters: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    searchTerm?: string;
  }) {
    let query = supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .order('date', { ascending: false });

    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.searchTerm) {
      query = query.ilike('description', `%${filters.searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as (Expense & { category: Category })[];
  },

  // Get a single expense by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Expense & { category: Category };
  },

  // Create a new expense
  async create(expense: Omit<Expense, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Expense & { category: Category };
  },

  // Update an expense
  async update(id: string, expense: Partial<Expense>) {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Expense & { category: Category };
  },

  // Delete an expense
  async delete(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get recurring expenses
  async getRecurring() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_recurring', true)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as (Expense & { category: Category })[];
  },
};

// Category operations
export const categoryOperations = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Category[];
  },

  // Get a single category by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  // Create a new category
  async create(category: Omit<Category, 'id'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  // Update a category
  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  // Delete a category
  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Budget operations
export const budgetOperations = {
  // Get all budgets
  async getAll() {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Budget & { category: Category | null })[];
  },

  // Get a single budget by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Budget & { category: Category | null };
  },

  // Create a new budget
  async create(budget: Omit<Budget, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Budget & { category: Category | null };
  },

  // Update a budget
  async update(id: string, budget: Partial<Budget>) {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Budget & { category: Category | null };
  },

  // Delete a budget
  async delete(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get budget vs actual spending
  async getBudgetStatus(categoryId?: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get budgets
    let budgetQuery = supabase
      .from('budgets')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('period', 'monthly');

    if (categoryId) {
      budgetQuery = budgetQuery.eq('category_id', categoryId);
    }

    const { data: budgets, error: budgetError } = await budgetQuery;
    if (budgetError) throw budgetError;

    // Get expenses for the current month
    let expenseQuery = supabase
      .from('expenses')
      .select('amount, category_id')
      .gte('date', startOfMonth.toISOString())
      .lte('date', endOfMonth.toISOString());

    if (categoryId) {
      expenseQuery = expenseQuery.eq('category_id', categoryId);
    }

    const { data: expenses, error: expenseError } = await expenseQuery;
    if (expenseError) throw expenseError;

    // Calculate spending per category
    const spendingByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category_id] = (acc[expense.category_id] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    // Combine budget and spending data
    return budgets.map((budget) => ({
      budget,
      spent: spendingByCategory[budget.category_id || ''] || 0,
      remaining: budget.amount - (spendingByCategory[budget.category_id || ''] || 0),
      percentage: ((spendingByCategory[budget.category_id || ''] || 0) / budget.amount) * 100,
    }));
  },
};

// Analytics operations
export const analyticsOperations = {
  // Get expense summary for a date range
  async getSummary(startDate: string, endDate: string) {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) throw error;

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const count = expenses.length;
    
    return {
      total,
      count,
      average: count > 0 ? total / count : 0,
    };
  },

  // Get category breakdown
  async getCategoryBreakdown(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        amount,
        category:categories(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) throw error;

    type BreakdownItem = { category: Category; amount: number; count: number };
    
    const breakdown = (data as any[]).reduce<Record<string, BreakdownItem>>((acc, expense) => {
      const category = expense.category as Category;
      const categoryId = category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: category,
          amount: 0,
          count: 0,
        };
      }
      acc[categoryId].amount += Number(expense.amount);
      acc[categoryId].count += 1;
      return acc;
    }, {});

    const breakdownValues = Object.values(breakdown) as BreakdownItem[];
    const total = breakdownValues.reduce((sum, item) => sum + item.amount, 0);

    return breakdownValues.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
    }));
  },

  // Get spending trend over time
  async getSpendingTrend(startDate: string, endDate: string, groupBy: 'day' | 'week' | 'month' = 'day') {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, date')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) throw error;

    // Group expenses by date
    const grouped = data.reduce((acc, expense) => {
      const date = new Date(expense.date);
      let key: string;

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};

