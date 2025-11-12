'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ExpenseFiltersProps {
  onFilter: (filters: {
    searchTerm?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export function ExpenseFilters({ onFilter }: ExpenseFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const handleApplyFilters = () => {
    onFilter({
      searchTerm: searchTerm || undefined,
      categoryId: categoryId || undefined,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryId('');
    setStartDate(undefined);
    setEndDate(undefined);
    onFilter({});
  };

  const hasActiveFilters = searchTerm || categoryId || startDate || endDate;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
        <Button onClick={handleApplyFilters}>Search</Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <CategorySelector
                value={categoryId}
                onValueChange={setCategoryId}
                label="Filter by Category"
              />
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

