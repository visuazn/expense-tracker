'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface SpendingTrendChartProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), 'MMM dd'),
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
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          }
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ fill: '#8884d8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

