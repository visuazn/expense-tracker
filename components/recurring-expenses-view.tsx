'use client';

import { useState, useEffect } from 'react';
import { expenseOperations } from '@/lib/supabase';
import { Expense, Category } from '@/lib/types';
import { getUpcomingRecurringExpenses } from '@/lib/recurring-utils';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CategoryBadge } from './category-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RepeatIcon, Calendar } from 'lucide-react';
import { Loading } from './loading';

export function RecurringExpensesView() {
  const [recurringExpenses, setRecurringExpenses] = useState<
    (Expense & { category: Category })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecurringExpenses();
  }, []);

  const loadRecurringExpenses = async () => {
    try {
      setLoading(true);
      const expenses = await expenseOperations.getRecurring();
      setRecurringExpenses(expenses);
    } catch (error) {
      console.error('Error loading recurring expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading recurring expenses..." />;
  }

  const upcoming = getUpcomingRecurringExpenses(recurringExpenses, 30);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Recurring Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RepeatIcon className="h-5 w-5" />
            Active Recurring Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recurringExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recurring expenses set up
            </p>
          ) : (
            <div className="space-y-4">
              {recurringExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={expense.category} />
                      <Badge variant="outline" className="text-xs">
                        {expense.recurrence_pattern}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Started {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Occurrences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming (Next 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No upcoming recurring expenses
            </p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((item, index) => (
                <div
                  key={`${item.expense.id}-${index}`}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{item.expense.description}</p>
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={item.expense.category} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(item.expense.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.nextDate.toISOString())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

