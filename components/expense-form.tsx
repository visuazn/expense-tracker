'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ExpenseFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategorySelector } from './category-selector';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Expense',
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    category_id: initialData?.category_id || '',
    date: initialData?.date || new Date().toISOString(),
    is_recurring: initialData?.is_recurring || false,
    recurrence_pattern: initialData?.recurrence_pattern || null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.is_recurring && !formData.recurrence_pattern) {
      newErrors.recurrence_pattern = 'Recurrence pattern is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount || ''}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
          }
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="What did you spend on?"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <CategorySelector
          value={formData.category_id}
          onValueChange={(value) =>
            setFormData({ ...formData, category_id: value })
          }
          required
        />
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>
          Date <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !formData.date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? (
                format(new Date(formData.date), 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.date ? new Date(formData.date) : undefined}
              onSelect={(date) =>
                setFormData({
                  ...formData,
                  date: date ? date.toISOString() : new Date().toISOString(),
                })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date}</p>
        )}
      </div>

      {/* Recurring */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_recurring"
            checked={formData.is_recurring}
            onChange={(e) =>
              setFormData({
                ...formData,
                is_recurring: e.target.checked,
                recurrence_pattern: e.target.checked
                  ? formData.recurrence_pattern || 'monthly'
                  : null,
              })
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="is_recurring" className="font-normal cursor-pointer">
            This is a recurring expense
          </Label>
        </div>

        {formData.is_recurring && (
          <div className="space-y-2 pl-6">
            <Label>Recurrence Pattern</Label>
            <Select
              value={formData.recurrence_pattern || 'monthly'}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                setFormData({ ...formData, recurrence_pattern: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurrence_pattern && (
              <p className="text-sm text-destructive">
                {errors.recurrence_pattern}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

