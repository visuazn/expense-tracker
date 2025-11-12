import { SplitExpense, SplitUser, Settlement } from './split-types';

/**
 * Calculate who owes whom based on all expenses
 */
export function calculateSettlements(
  expenses: SplitExpense[],
  users: SplitUser[]
): Settlement[] {
  // Calculate net balance for each user
  const balances: Record<string, number> = {};
  
  // Initialize balances
  users.forEach(user => {
    balances[user.id] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    const payer = expense.paidBy;
    const splitCount = expense.splitAmong.length;
    const sharePerPerson = expense.amount / splitCount;

    // Payer paid the full amount
    balances[payer] += expense.amount;

    // Each person in split owes their share
    expense.splitAmong.forEach(userId => {
      balances[userId] -= sharePerPerson;
    });
  });

  // Convert balances to settlements (simplified debt reduction)
  const settlements: Settlement[] = [];
  const userBalances = users.map(user => ({
    id: user.id,
    name: user.name,
    balance: balances[user.id],
  }));

  // Sort by balance (creditors first, then debtors)
  const creditors = userBalances.filter(u => u.balance > 0.01).sort((a, b) => b.balance - a.balance);
  const debtors = userBalances.filter(u => u.balance < -0.01).sort((a, b) => a.balance - b.balance);

  // Match debtors with creditors
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    if (amount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100,
      });

      creditor.balance -= amount;
      debtor.balance += amount;
    }

    if (Math.abs(creditor.balance) < 0.01) creditorIndex++;
    if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
  }

  return settlements;
}

/**
 * Get user's total expenses
 */
export function getUserTotalPaid(expenses: SplitExpense[], userId: string): number {
  return expenses
    .filter(e => e.paidBy === userId)
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Get user's total share of expenses
 */
export function getUserTotalShare(expenses: SplitExpense[], userId: string): number {
  return expenses
    .filter(e => e.splitAmong.includes(userId))
    .reduce((sum, e) => sum + e.amount / e.splitAmong.length, 0);
}

/**
 * Get category-wise breakdown
 */
export function getCategoryBreakdown(expenses: SplitExpense[]): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
}

