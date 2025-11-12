'use client';

import { useState, useEffect } from 'react';
import { analyticsOperations } from '@/lib/supabase';
import { Category } from '@/lib/types';
import { ExpensePieChart } from '@/components/charts/expense-pie-chart';
import { SpendingTrendChart } from '@/components/charts/spending-trend-chart';
import { MonthlyComparisonChart } from '@/components/charts/monthly-comparison-chart';
import { Loading } from '@/components/loading';
import { ErrorMessage } from '@/components/error-message';
import { formatCurrency, getDateRange } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryBadge } from '@/components/category-badge';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
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
  const [monthlyData, setMonthlyData] = useState<
    { date: string; amount: number }[]
  >([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { startDate, endDate } = getDateRange(period);

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
      setCategoryBreakdown(breakdown.filter((item) => item.amount > 0));

      // Load spending trend
      const trend = await analyticsOperations.getSpendingTrend(
        startDate,
        endDate,
        period === 'year' || period === 'all' ? 'month' : period === 'month' ? 'week' : 'day'
      );
      setSpendingTrend(trend);

      // Load monthly comparison (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const monthlyTrend = await analyticsOperations.getSpendingTrend(
        sixMonthsAgo.toISOString(),
        new Date().toISOString(),
        'month'
      );
      setMonthlyData(monthlyTrend);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading analytics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights into your spending
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value: 'week' | 'month' | 'year' | 'all') =>
            setPeriod(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary?.total || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Average per Transaction
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary?.average || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{summary?.count || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <CategoryBadge category={item.category} />
                    <span className="font-semibold">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.category.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.count} transactions • {item.percentage.toFixed(1)}%
                  </p>
                </div>
              ))}
              {categoryBreakdown.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No expenses in this period
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingTrendChart data={spendingTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyComparisonChart data={monthlyData} />
        </CardContent>
      </Card>
    </div>
  );
}

