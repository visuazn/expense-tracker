'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpensePieChartProps {
  data: {
    category: {
      name: string;
      color: string;
    };
    amount: number;
  }[];
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  const chartData = data.map((item) => ({
    name: item.category.name,
    value: item.amount,
    color: item.category.color,
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
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

