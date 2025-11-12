'use client';

import { useState, useEffect } from 'react';
import { monthlyBudgetOperations, budgetCategoryOperations } from '@/lib/budget-planning-operations';
import { MonthlyBudget, BudgetCategory, MonthlyBudgetSummary } from '@/lib/budget-planning-types';
import { BudgetPlanningTable } from '@/components/budget-planning-table';
import { BudgetPlanningChart } from '@/components/budget-planning-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loading } from '@/components/loading';
import { ErrorMessage } from '@/components/error-message';
import { formatCurrency } from '@/lib/utils';
import { Plus, Copy, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export default function BudgetPlanningPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [budgets, setBudgets] = useState<(MonthlyBudget & { category: BudgetCategory })[]>([]);
  const [summary, setSummary] = useState<MonthlyBudgetSummary | null>(null);
  const [yearSummary, setYearSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [budgetData, summaryData, yearData] = await Promise.all([
        monthlyBudgetOperations.getByMonth(selectedYear, selectedMonth),
        monthlyBudgetOperations.getSummary(selectedYear, selectedMonth),
        monthlyBudgetOperations.getYearSummary(selectedYear),
      ]);

      setBudgets(budgetData);
      setSummary(summaryData);
      setYearSummary(yearData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeMonth = async () => {
    try {
      await monthlyBudgetOperations.initializeMonth(selectedYear, selectedMonth);
      toast.success('Month initialized with all categories');
      loadData();
    } catch (error) {
      toast.error('Failed to initialize month');
      console.error(error);
    }
  };

  const handleCopyFromPrevious = async () => {
    try {
      await monthlyBudgetOperations.copyFromPreviousMonth(selectedYear, selectedMonth);
      toast.success('Copied planned amounts from previous month');
      loadData();
    } catch (error) {
      toast.error('Failed to copy from previous month');
      console.error(error);
    }
  };

  const handleUpdateBudget = async (id: string, data: any) => {
    try {
      await monthlyBudgetOperations.update(id, data);
      toast.success('Budget updated');
      loadData();
    } catch (error) {
      toast.error('Failed to update budget');
      console.error(error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await budgetCategoryOperations.create({
        name: newCategoryName.trim(),
        type: newCategoryType,
        is_default: false,
        display_order: 100,
      });
      
      toast.success('Category added');
      setShowAddCategory(false);
      setNewCategoryName('');
      
      // Initialize the new category for current month
      await handleInitializeMonth();
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (loading) {
    return <Loading text="Loading budget planning..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const netSavings = (summary?.savings_actual || 0);
  const savingsPercent = summary && summary.total_income > 0
    ? (netSavings / summary.total_income) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monthly Budget Planning</h1>
          <p className="text-muted-foreground mt-1">
            Plan and track your monthly income and expenses
          </p>
        </div>
        <Button onClick={() => setShowAddCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <Label>Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <Label>Month</Label>
              <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleInitializeMonth} variant="outline">
              Initialize Month
            </Button>

            <Button onClick={handleCopyFromPrevious} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy from Previous
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.total_income)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.total_expenses_actual)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Planned: {formatCurrency(summary.total_expenses_planned)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Net Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netSavings)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {savingsPercent.toFixed(1)}% of income
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Planned vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.total_expenses_actual > 0
                  ? ((summary.total_expenses_actual / summary.total_expenses_planned) * 100).toFixed(0)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Of planned expenses
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="budget" className="space-y-6">
        <TabsList>
          <TabsTrigger value="budget">Budget Details</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>
                {MONTHS[selectedMonth - 1]} {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetPlanningTable
                budgets={budgets}
                onUpdate={handleUpdateBudget}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetPlanningChart
                data={yearSummary}
                type="income-vs-expenses"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned vs Actual Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetPlanningChart
                data={yearSummary}
                type="planned-vs-actual"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetPlanningChart
                data={yearSummary}
                type="savings-trend"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                placeholder="e.g., Savings 2"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={newCategoryType} onValueChange={(v: 'income' | 'expense') => setNewCategoryType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

