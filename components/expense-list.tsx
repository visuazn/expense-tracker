'use client';

import { useState } from 'react';
import { Expense, Category } from '@/lib/types';
import { expenseOperations } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CategoryBadge } from './category-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, RepeatIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExpenseForm } from './expense-form';
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

interface ExpenseListProps {
  expenses: (Expense & { category: Category })[];
  onExpenseChange: () => void;
}

export function ExpenseList({ expenses, onExpenseChange }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<
    (Expense & { category: Category }) | null
  >(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(
    null
  );

  const handleEdit = async (data: any) => {
    if (!editingExpense) return;

    try {
      await expenseOperations.update(editingExpense.id, data);
      toast.success('Expense updated successfully');
      setEditingExpense(null);
      onExpenseChange();
    } catch (error) {
      toast.error('Failed to update expense');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deletingExpenseId) return;

    try {
      await expenseOperations.delete(deletingExpenseId);
      toast.success('Expense deleted successfully');
      setDeletingExpenseId(null);
      onExpenseChange();
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error(error);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No expenses found
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {expense.description}
                    {expense.is_recurring && (
                      <RepeatIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={expense.category} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingExpense(expense)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingExpenseId(expense.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialData={{
                amount: editingExpense.amount,
                description: editingExpense.description,
                category_id: editingExpense.category_id,
                date: editingExpense.date,
                is_recurring: editingExpense.is_recurring,
                recurrence_pattern: editingExpense.recurrence_pattern,
              }}
              onSubmit={handleEdit}
              onCancel={() => setEditingExpense(null)}
              submitLabel="Update Expense"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingExpenseId}
        onOpenChange={() => setDeletingExpenseId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

