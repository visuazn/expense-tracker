'use client';

import { useState, useEffect } from 'react';
import { budgetOperations } from '@/lib/supabase';
import { Budget, Category } from '@/lib/types';
import { BudgetCard } from '@/components/budget-card';
import { BudgetForm } from '@/components/budget-form';
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
import { Plus, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<
    {
      budget: Budget & { category: Category | null };
      spent: number;
      remaining: number;
      percentage: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<
    (Budget & { category: Category | null }) | null
  >(null);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetOperations.getBudgetStatus();
      setBudgets(data);
    } catch (err) {
      console.error('Error loading budgets:', err);
      setError('Failed to load budgets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (data: any) => {
    try {
      await budgetOperations.create(data);
      toast.success('Budget created successfully');
      setShowAddDialog(false);
      loadBudgets();
    } catch (error) {
      toast.error('Failed to create budget');
      console.error(error);
    }
  };

  const handleEditBudget = async (data: any) => {
    if (!editingBudget) return;

    try {
      await budgetOperations.update(editingBudget.id, data);
      toast.success('Budget updated successfully');
      setEditingBudget(null);
      loadBudgets();
    } catch (error) {
      toast.error('Failed to update budget');
      console.error(error);
    }
  };

  const handleDeleteBudget = async () => {
    if (!deletingBudgetId) return;

    try {
      await budgetOperations.delete(deletingBudgetId);
      toast.success('Budget deleted successfully');
      setDeletingBudgetId(null);
      loadBudgets();
    } catch (error) {
      toast.error('Failed to delete budget');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Set and track your spending limits
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {loading && <Loading />}

      {error && !loading && <ErrorMessage message={error} />}

      {!loading && !error && budgets.length === 0 && (
        <EmptyState
          icon={Wallet}
          title="No budgets set"
          description="Create your first budget to track your spending limits."
          action={{
            label: 'Add Budget',
            onClick: () => setShowAddDialog(true),
          }}
        />
      )}

      {!loading && !error && budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((item) => (
            <BudgetCard
              key={item.budget.id}
              budget={item.budget}
              spent={item.spent}
              remaining={item.remaining}
              percentage={item.percentage}
              onEdit={() => setEditingBudget(item.budget)}
              onDelete={() => setDeletingBudgetId(item.budget.id)}
            />
          ))}
        </div>
      )}

      {/* Add Budget Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleAddBudget}
            onCancel={() => setShowAddDialog(false)}
            submitLabel="Add Budget"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <BudgetForm
              initialData={{
                category_id: editingBudget.category_id,
                amount: editingBudget.amount,
                period: editingBudget.period,
                start_date: editingBudget.start_date,
              }}
              onSubmit={handleEditBudget}
              onCancel={() => setEditingBudget(null)}
              submitLabel="Update Budget"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingBudgetId}
        onOpenChange={() => setDeletingBudgetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

