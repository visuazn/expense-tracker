import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format relative date
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

// Get date range for different periods
export function getDateRange(period: 'week' | 'month' | 'year' | 'all'): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const endDate = now.toISOString();
  let startDate: Date;

  switch (period) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
      startDate = new Date(2000, 0, 1);
      break;
  }

  return {
    startDate: startDate.toISOString(),
    endDate,
  };
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Validate expense form
export function validateExpenseForm(data: {
  amount: string;
  description: string;
  category_id: string;
  date: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.amount || Number(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }

  if (!data.category_id) {
    errors.category_id = 'Category is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Generate sample expenses (for demo purposes)
export function generateSampleExpenses() {
  const now = new Date();
  const categories = [
    { id: '1', name: 'Food' },
    { id: '2', name: 'Transport' },
    { id: '3', name: 'Entertainment' },
    { id: '4', name: 'Bills' },
  ];

  const descriptions = [
    'Grocery shopping',
    'Gas station',
    'Restaurant dinner',
    'Movie tickets',
    'Electricity bill',
    'Coffee',
    'Uber ride',
    'Netflix subscription',
  ];

  const expenses = [];
  for (let i = 0; i < 20; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    expenses.push({
      amount: Math.floor(Math.random() * 200) + 10,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      category_id: categories[Math.floor(Math.random() * categories.length)].id,
      date: date.toISOString(),
      is_recurring: Math.random() > 0.8,
      recurrence_pattern: Math.random() > 0.5 ? 'monthly' : 'weekly',
    });
  }

  return expenses;
}
