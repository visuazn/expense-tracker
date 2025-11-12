'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { expenseOperations, analyticsOperations } from '@/lib/supabase';
import { Expense, Category } from '@/lib/types';
import { SummaryCard } from '@/components/summary-card';
import { ExpensePieChart } from '@/components/charts/expense-pie-chart';
import { SpendingTrendChart } from '@/components/charts/spending-trend-chart';
import { Loading } from '@/components/loading';
import { ErrorMessage } from '@/components/error-message';
import { formatCurrency, getDateRange } from '@/lib/utils';
import { DollarSign, TrendingUp, Receipt, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [recentExpenses, setRecentExpenses] = useState<
    (Expense & { category: Category })[]
  >([]);
  const [summary, setSummary] = useState<{
    total: number;
    count: number;
    average: number;
  } | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    {
      category: Category;
      amount: number;
      count: number;
      percentage: number;
    }[]
  >([]);
  const [spendingTrend, setSpendingTrend] = useState<
    { date: string; amount: number }[]
  >([]);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { startDate, endDate } = getDateRange(period);

      // Load recent expenses
      const expenses = await expenseOperations.getFiltered({
        startDate,
        endDate,
      });
      setRecentExpenses(expenses.slice(0, 5));

      // Load summary
      const summaryData = await analyticsOperations.getSummary(
        startDate,
        endDate
      );
      setSummary(summaryData);

      // Load category breakdown
      const breakdown = await analyticsOperations.getCategoryBreakdown(
        startDate,
        endDate
      );
      setCategoryBreakdown(breakdown);

      // Load spending trend
      const trend = await analyticsOperations.getSpendingTrend(
        startDate,
        endDate,
        period === 'year' ? 'month' : 'day'
      );
      setSpendingTrend(trend);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your expenses
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value: 'week' | 'month' | 'year') => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary?.total || 0)}
          icon={DollarSign}
          description={`${period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'This year'}`}
        />
        <SummaryCard
          title="Average per Transaction"
          value={formatCurrency(summary?.average || 0)}
          icon={TrendingUp}
        />
        <SummaryCard
          title="Total Transactions"
          value={summary?.count || 0}
          icon={Receipt}
        />
        <SummaryCard
          title="Categories"
          value={categoryBreakdown.filter((c) => c.amount > 0).length}
          icon={Calendar}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={categoryBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart data={spendingTrend} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Expenses</CardTitle>
          <Link href="/expenses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recent expenses
            </p>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category.name}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
