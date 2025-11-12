'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { categoryOperations } from '@/lib/supabase';
import { CategoryIcon } from './category-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CategorySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function CategorySelector({
  value,
  onValueChange,
  label = 'Category',
  required = false,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryOperations.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <CategoryIcon icon={category.icon} color={category.color} />
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

