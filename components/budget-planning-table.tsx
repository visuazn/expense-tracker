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
import { Check, X, Edit, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BudgetPlanningTableProps {
  budgets: (MonthlyBudget & { category: BudgetCategory })[];
  onUpdate: (id: string, data: { planned_amount?: number; actual_amount?: number; notes?: string }) => Promise<void>;
  onBulkUpdate: (updates: Array<{ id: string; planned_amount: number; actual_amount: number }>) => Promise<void>;
}

export function BudgetPlanningTable({ budgets, onUpdate, onBulkUpdate }: BudgetPlanningTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlanned, setEditPlanned] = useState('');
  const [editActual, setEditActual] = useState('');
  const [saving, setSaving] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkData, setBulkData] = useState<Record<string, { planned: string; actual: string }>>({});

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

  const startBulkEdit = () => {
    const initialData: Record<string, { planned: string; actual: string }> = {};
    budgets.forEach(budget => {
      initialData[budget.id] = {
        planned: budget.planned_amount.toString(),
        actual: budget.actual_amount.toString(),
      };
    });
    setBulkData(initialData);
    setBulkEditMode(true);
  };

  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    setBulkData({});
  };

  const saveBulkEdit = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(bulkData).map(([id, values]) => ({
        id,
        planned_amount: parseFloat(values.planned) || 0,
        actual_amount: parseFloat(values.actual) || 0,
      }));
      await onBulkUpdate(updates);
      setBulkEditMode(false);
      setBulkData({});
    } catch (error) {
      console.error('Error saving bulk edit:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateBulkData = (id: string, field: 'planned' | 'actual', value: string) => {
    setBulkData(prev => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      };
      
      // When planned changes, auto-copy to actual (but can be manually changed)
      if (field === 'planned') {
        updated[id].actual = value;
      }
      
      return updated;
    });
  };

  const income = budgets.filter(b => b.category.type === 'income');
  const expenses = budgets.filter(b => b.category.type === 'expense');

  const renderRow = (budget: MonthlyBudget & { category: BudgetCategory }) => {
    const isEditing = editingId === budget.id;
    const pending = budget.planned_amount - budget.actual_amount;
    const isPending = Math.abs(pending) > 0.01;

    // In bulk edit mode, show editable fields for all rows
    if (bulkEditMode) {
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
            <Input
              type="number"
              step="0.01"
              value={bulkData[budget.id]?.planned || '0'}
              onChange={(e) => updateBulkData(budget.id, 'planned', e.target.value)}
              className="w-32"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              step="0.01"
              value={bulkData[budget.id]?.actual || '0'}
              onChange={(e) => updateBulkData(budget.id, 'actual', e.target.value)}
              className="w-32"
            />
          </TableCell>
          <TableCell>
            <span className={`font-medium ${isPending ? 'text-orange-600' : 'text-green-600'}`}>
              {formatCurrency(Math.abs(pending))}
            </span>
          </TableCell>
          <TableCell>
            {/* Empty in bulk mode */}
          </TableCell>
        </TableRow>
      );
    }

    // Single edit mode (existing behavior)
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
      {/* Bulk Edit Controls */}
      {budgets.length > 0 && (
        <div className="flex justify-end gap-2">
          {bulkEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={cancelBulkEdit}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={saveBulkEdit}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save All'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={startBulkEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit All
            </Button>
          )}
        </div>
      )}

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

