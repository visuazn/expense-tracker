'use client';

import { useState, useEffect } from 'react';
import { SplitData, SplitDay, SplitExpense } from '@/lib/split-types';
import { loadSplitData, saveSplitData, clearSplitData } from '@/lib/split-storage';
import { calculateSettlements, getCategoryBreakdown } from '@/lib/split-calculator';
import { SplitUserManager } from '@/components/split-user-manager';
import { SplitExpenseForm } from '@/components/split-expense-form';
import { SplitDayView } from '@/components/split-day-view';
import { SplitSettlement } from '@/components/split-settlement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SplitExpensesPage() {
  const [data, setData] = useState<SplitData>({ users: [], days: [] });
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedData = loadSplitData();
    setData(loadedData);
    if (loadedData.days.length > 0 && !selectedDayId) {
      setSelectedDayId(loadedData.days[0].id);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveSplitData(data);
  }, [data]);

  const addUser = (name: string) => {
    const newUser = {
      id: Date.now().toString(),
      name,
    };
    setData((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    toast.success(`${name} added`);
  };

  const removeUser = (userId: string) => {
    // Check if user has any expenses
    const hasExpenses = data.days.some((day) =>
      day.expenses.some(
        (e) => e.paidBy === userId || e.splitAmong.includes(userId)
      )
    );

    if (hasExpenses) {
      toast.error('Cannot remove user with existing expenses');
      return;
    }

    setData((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== userId),
    }));
    toast.success('User removed');
  };

  const addDay = () => {
    const dayNumber = data.days.length + 1;
    const newDay: SplitDay = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: `Day ${dayNumber}`,
      expenses: [],
    };
    setData((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
    setSelectedDayId(newDay.id);
    toast.success('New day added');
  };

  const removeDay = (dayId: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.filter((d) => d.id !== dayId),
    }));
    if (selectedDayId === dayId) {
      setSelectedDayId(data.days[0]?.id || null);
    }
    toast.success('Day removed');
  };

  const addExpense = (
    dayId: string,
    expenseData: {
      description: string;
      amount: number;
      category: string;
      paidBy: string;
      splitAmong: string[];
    }
  ) => {
    const newExpense: SplitExpense = {
      id: Date.now().toString(),
      ...expenseData,
      date: new Date().toISOString(),
      dayId,
    };

    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId
          ? { ...day, expenses: [...day.expenses, newExpense] }
          : day
      ),
    }));
    toast.success('Expense added');
  };

  const deleteExpense = (expenseId: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => ({
        ...day,
        expenses: day.expenses.filter((e) => e.id !== expenseId),
      })),
    }));
    toast.success('Expense deleted');
  };

  const handleClearAll = () => {
    clearSplitData();
    setData({ users: [], days: [] });
    setSelectedDayId(null);
    setShowClearDialog(false);
    toast.success('All data cleared');
  };

  // Calculate totals and settlements
  const allExpenses = data.days.flatMap((day) => day.expenses);
  const totalAmount = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const settlements = calculateSettlements(allExpenses, data.users);
  const categoryBreakdown = getCategoryBreakdown(allExpenses);

  const selectedDay = data.days.find((d) => d.id === selectedDayId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Split</h1>
          <p className="text-muted-foreground mt-1">
            Split expenses with friends (stored locally)
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowClearDialog(true)}
          disabled={data.users.length === 0 && data.days.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Summary Cards */}
      {allExpenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {allExpenses.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Per Person</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.users.length > 0 ? totalAmount / data.users.length : 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average share
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Settlements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{settlements.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Transactions needed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Setup */}
        <div className="space-y-6">
          {/* User Management */}
          <SplitUserManager
            users={data.users}
            onAddUser={addUser}
            onRemoveUser={removeUser}
          />

          {/* Day Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Days</CardTitle>
                <Button size="sm" onClick={addDay}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.days.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Add a day to start tracking expenses
                </p>
              ) : (
                <div className="space-y-2">
                  {data.days.map((day) => (
                    <div
                      key={day.id}
                      className={`flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-accent ${
                        selectedDayId === day.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedDayId(day.id)}
                    >
                      <span className="font-medium">{day.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {day.expenses.length} expenses
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDay(day.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          {Object.keys(categoryBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  By Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(categoryBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column - Add Expense & Day View */}
        <div className="space-y-6">
          {selectedDay && (
            <>
              <SplitExpenseForm
                users={data.users}
                dayId={selectedDay.id}
                onAdd={(expense) => addExpense(selectedDay.id, expense)}
              />
              <SplitDayView
                day={selectedDay}
                users={data.users}
                onDeleteExpense={deleteExpense}
              />
            </>
          )}
        </div>

        {/* Right Column - Settlement */}
        <div>
          <SplitSettlement settlements={settlements} />
        </div>
      </div>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all users, days, and expenses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>
              Clear Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

