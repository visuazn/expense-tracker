'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface MonthlyComparisonChartProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  const chartData = data.map((item) => ({
    month: format(new Date(item.date + '-01'), 'MMM yyyy'),
    amount: item.amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          }
        />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

