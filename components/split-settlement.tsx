'use client';

import { Settlement } from '@/lib/split-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SplitSettlementProps {
  settlements: Settlement[];
}

export function SplitSettlement({ settlements }: SplitSettlementProps) {
  if (settlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Settlement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            All settled up! 🎉
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who Owes Whom</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium">{settlement.from}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{settlement.to}</span>
              </div>
              <span className="font-bold text-lg">
                {formatCurrency(settlement.amount)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Tip: These are the minimum number of transactions needed to settle all expenses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

