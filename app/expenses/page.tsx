'use client';

import { useState, useEffect } from 'react';
import { expenseOperations } from '@/lib/supabase';
import { Expense, Category } from '@/lib/types';
import { ExpenseList } from '@/components/expense-list';
import { ExpenseForm } from '@/components/expense-form';
import { ExpenseFilters } from '@/components/expense-filters';
import { Loading } from '@/components/loading';
import { ErrorMessage } from '@/components/error-message';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Receipt, RepeatIcon } from 'lucide-react';
import { toast } from 'sonner';
import { RecurringExpensesView } from '@/components/recurring-expenses-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<(Expense & { category: Category })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState<{
    searchTerm?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  useEffect(() => {
    loadExpenses();
  }, [filters]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseOperations.getFiltered(filters);
      setExpenses(data);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (data: any) => {
    try {
      await expenseOperations.create(data);
      toast.success('Expense added successfully');
      setShowAddDialog(false);
      loadExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your expenses
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            <Receipt className="h-4 w-4 mr-2" />
            All Expenses
          </TabsTrigger>
          <TabsTrigger value="recurring">
            <RepeatIcon className="h-4 w-4 mr-2" />
            Recurring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <ExpenseFilters onFilter={setFilters} />

          {loading && <Loading />}

          {error && !loading && <ErrorMessage message={error} />}

          {!loading && !error && expenses.length === 0 && (
            <EmptyState
              icon={Receipt}
              title="No expenses yet"
              description="Start tracking your expenses by adding your first one."
              action={{
                label: 'Add Expense',
                onClick: () => setShowAddDialog(true),
              }}
            />
          )}

          {!loading && !error && expenses.length > 0 && (
            <ExpenseList expenses={expenses} onExpenseChange={loadExpenses} />
          )}
        </TabsContent>

        <TabsContent value="recurring">
          <RecurringExpensesView />
        </TabsContent>
      </Tabs>

      {/* Add Expense Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setShowAddDialog(false)}
            submitLabel="Add Expense"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

