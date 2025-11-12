'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface BudgetPlanningChartProps {
  data: {
    month: number;
    total_income: number;
    total_expenses_planned: number;
    total_expenses_actual: number;
    savings_planned: number;
    savings_actual: number;
  }[];
  type: 'income-vs-expenses' | 'planned-vs-actual' | 'savings-trend';
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function BudgetPlanningChart({ data, type }: BudgetPlanningChartProps) {
  const chartData = data.map(item => ({
    month: MONTH_NAMES[item.month - 1],
    income: item.total_income,
    expensesPlanned: item.total_expenses_planned,
    expensesActual: item.total_expenses_actual,
    savingsPlanned: item.savings_planned,
    savingsActual: item.savings_actual,
  }));

  if (type === 'income-vs-expenses') {
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
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expensesActual" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'planned-vs-actual') {
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
          <Legend />
          <Bar dataKey="expensesPlanned" fill="#3B82F6" name="Planned" />
          <Bar dataKey="expensesActual" fill="#8B5CF6" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // savings-trend
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
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
        <Legend />
        <Line
          type="monotone"
          dataKey="savingsPlanned"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Planned Savings"
          dot={{ fill: '#3B82F6' }}
        />
        <Line
          type="monotone"
          dataKey="savingsActual"
          stroke="#10B981"
          strokeWidth={2}
          name="Actual Savings"
          dot={{ fill: '#10B981' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

