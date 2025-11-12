'use client';

import { SplitDay, SplitUser, SplitExpense } from '@/lib/split-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SplitDayViewProps {
  day: SplitDay;
  users: SplitUser[];
  onDeleteExpense: (expenseId: string) => void;
}

export function SplitDayView({ day, users, onDeleteExpense }: SplitDayViewProps) {
  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown';
  };

  const dayTotal = day.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>{day.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(day.date)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold">{formatCurrency(dayTotal)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {day.expenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No expenses for this day
          </p>
        ) : (
          <div className="space-y-3">
            {day.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{expense.category}</Badge>
                    <span className="font-medium">{expense.description}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Paid by: <strong>{getUserName(expense.paidBy)}</strong></span>
                    <span>•</span>
                    <span>
                      Split: {expense.splitAmong.map((id) => getUserName(id)).join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {formatCurrency(expense.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

