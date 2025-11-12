'use client';

import { useState } from 'react';
import { MonthlyBudget, BudgetCategory } from '@/lib/budget-planning-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Check, X, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BudgetPlanningTableProps {
  budgets: (MonthlyBudget & { category: BudgetCategory })[];
  onUpdate: (id: string, data: { planned_amount?: number; actual_amount?: number; notes?: string }) => Promise<void>;
}

export function BudgetPlanningTable({ budgets, onUpdate }: BudgetPlanningTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlanned, setEditPlanned] = useState('');
  const [editActual, setEditActual] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (budget: MonthlyBudget) => {
    setEditingId(budget.id);
    setEditPlanned(budget.planned_amount.toString());
    setEditActual(budget.actual_amount.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPlanned('');
    setEditActual('');
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      await onUpdate(id, {
        planned_amount: parseFloat(editPlanned) || 0,
        actual_amount: parseFloat(editActual) || 0,
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const income = budgets.filter(b => b.category.type === 'income');
  const expenses = budgets.filter(b => b.category.type === 'expense');

  const renderRow = (budget: MonthlyBudget & { category: BudgetCategory }) => {
    const isEditing = editingId === budget.id;
    const pending = budget.planned_amount - budget.actual_amount;
    const isPending = Math.abs(pending) > 0.01;

    return (
      <TableRow key={budget.id}>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium">{budget.category.name}</span>
            <Badge variant={budget.category.type === 'income' ? 'default' : 'secondary'} className="text-xs">
              {budget.category.type}
            </Badge>
          </div>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              value={editPlanned}
              onChange={(e) => setEditPlanned(e.target.value)}
              className="w-32"
              autoFocus
            />
          ) : (
            <span className="font-medium">{formatCurrency(budget.planned_amount)}</span>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              value={editActual}
              onChange={(e) => setEditActual(e.target.value)}
              className="w-32"
            />
          ) : (
            <span className="font-medium">{formatCurrency(budget.actual_amount)}</span>
          )}
        </TableCell>
        <TableCell>
          <span className={`font-medium ${isPending ? 'text-orange-600' : 'text-green-600'}`}>
            {formatCurrency(Math.abs(pending))}
          </span>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => saveEdit(budget.id)}
                disabled={saving}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={cancelEdit}
                disabled={saving}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => startEdit(budget)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      {/* Income Section */}
      {income.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-600">Income</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Planned</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {income.map(renderRow)}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Expenses Section */}
      {expenses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-600">Expenses</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Planned</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map(renderRow)}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {budgets.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No budget entries for this month. Click "Initialize Month" to get started.
        </p>
      )}
    </div>
  );
}

