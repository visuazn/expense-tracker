import { Budget, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { CategoryBadge } from './category-badge';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
  budget: Budget & { category: Category | null };
  spent: number;
  remaining: number;
  percentage: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function BudgetCard({
  budget,
  spent,
  remaining,
  percentage,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && !isOverBudget;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {budget.category ? (
            <CategoryBadge category={budget.category} />
          ) : (
            <Badge variant="outline">Overall Budget</Badge>
          )}
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(spent)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(budget.amount)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span
              className={cn(
                'font-medium',
                isOverBudget && 'text-destructive',
                isNearLimit && 'text-yellow-600'
              )}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(percentage, 100)}
            className={cn(
              isOverBudget && '[&>div]:bg-destructive',
              isNearLimit && '[&>div]:bg-yellow-500'
            )}
          />
          {isOverBudget && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>Over budget by {formatCurrency(Math.abs(remaining))}</span>
            </div>
          )}
          {isNearLimit && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Approaching budget limit</span>
            </div>
          )}
          {!isOverBudget && !isNearLimit && (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(remaining)} remaining
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="capitalize">{budget.period}</span>
          <span>
            Started {new Date(budget.start_date).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

