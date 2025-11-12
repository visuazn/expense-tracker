'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { BudgetFormData } from '@/lib/types';
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

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function BudgetForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Budget',
}: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category_id: initialData?.category_id || null,
    amount: initialData?.amount || 0,
    period: initialData?.period || 'monthly',
    start_date: initialData?.start_date || new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.period) {
      newErrors.period = 'Period is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
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
          Budget Amount <span className="text-destructive">*</span>
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

      {/* Category */}
      <div className="space-y-2">
        <CategorySelector
          value={formData.category_id || ''}
          onValueChange={(value) =>
            setFormData({ ...formData, category_id: value || null })
          }
          label="Category (optional)"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty for an overall budget
        </p>
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id}</p>
        )}
      </div>

      {/* Period */}
      <div className="space-y-2">
        <Label>
          Period <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.period}
          onValueChange={(value: 'monthly' | 'weekly' | 'yearly') =>
            setFormData({ ...formData, period: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {errors.period && (
          <p className="text-sm text-destructive">{errors.period}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label>
          Start Date <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !formData.start_date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.start_date ? (
                format(new Date(formData.start_date), 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.start_date ? new Date(formData.start_date) : undefined}
              onSelect={(date) =>
                setFormData({
                  ...formData,
                  start_date: date ? date.toISOString() : new Date().toISOString(),
                })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.start_date && (
          <p className="text-sm text-destructive">{errors.start_date}</p>
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

