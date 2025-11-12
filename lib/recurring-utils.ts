import { Expense } from './types';
import { expenseOperations } from './supabase';

/**
 * Calculate the next occurrence date for a recurring expense
 */
export function getNextOccurrence(
  lastDate: Date,
  pattern: 'daily' | 'weekly' | 'monthly'
): Date {
  const next = new Date(lastDate);

  switch (pattern) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next;
}

/**
 * Check if a recurring expense needs to be generated
 */
export function shouldGenerateNext(
  lastDate: Date,
  pattern: 'daily' | 'weekly' | 'monthly',
  now: Date = new Date()
): boolean {
  const nextDate = getNextOccurrence(lastDate, pattern);
  return nextDate <= now;
}

/**
 * Generate next occurrences for all recurring expenses
 * This function should be called periodically (e.g., daily via a cron job)
 */
export async function generateRecurringExpenses() {
  try {
    const recurringExpenses = await expenseOperations.getRecurring();
    const now = new Date();
    const generated: any[] = [];

    for (const expense of recurringExpenses) {
      if (!expense.recurrence_pattern) continue;

      const lastDate = new Date(expense.date);

      // Check if we need to generate new occurrences
      while (shouldGenerateNext(lastDate, expense.recurrence_pattern, now)) {
        const nextDate = getNextOccurrence(lastDate, expense.recurrence_pattern);

        // Don't generate future expenses
        if (nextDate > now) break;

        // Create the new expense occurrence
        const newExpense = {
          amount: expense.amount,
          description: expense.description,
          category_id: expense.category_id,
          date: nextDate.toISOString(),
          is_recurring: true,
          recurrence_pattern: expense.recurrence_pattern,
        };

        generated.push(newExpense);

        // Update lastDate for next iteration
        lastDate.setTime(nextDate.getTime());
      }
    }

    // Bulk create the generated expenses
    for (const expense of generated) {
      await expenseOperations.create(expense);
    }

    return {
      success: true,
      count: generated.length,
      message: `Generated ${generated.length} recurring expense(s)`,
    };
  } catch (error) {
    console.error('Error generating recurring expenses:', error);
    return {
      success: false,
      count: 0,
      message: 'Failed to generate recurring expenses',
    };
  }
}

/**
 * Get upcoming recurring expenses for the next N days
 */
export function getUpcomingRecurringExpenses(
  recurringExpenses: (Expense & { category: any })[],
  days: number = 30
): Array<{
  expense: Expense & { category: any };
  nextDate: Date;
}> {
  const now = new Date();
  const upcoming: Array<{
    expense: Expense & { category: any };
    nextDate: Date;
  }> = [];

  for (const expense of recurringExpenses) {
    if (!expense.recurrence_pattern) continue;

    let nextDate = getNextOccurrence(
      new Date(expense.date),
      expense.recurrence_pattern
    );

    // Find the next occurrence after today
    while (nextDate < now) {
      nextDate = getNextOccurrence(nextDate, expense.recurrence_pattern);
    }

    // Check if it's within the specified days
    const daysUntil =
      (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntil <= days) {
      upcoming.push({ expense, nextDate });
    }
  }

  // Sort by next date
  return upcoming.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
}

