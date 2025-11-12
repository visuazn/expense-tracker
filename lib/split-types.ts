// Types for expense splitting feature (local storage only)

export interface SplitUser {
  id: string;
  name: string;
}

export interface SplitExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  paidBy: string; // user id
  splitAmong: string[]; // array of user ids
  date: string;
  dayId: string;
}

export interface SplitDay {
  id: string;
  date: string;
  name: string;
  expenses: SplitExpense[];
}

export interface SplitData {
  users: SplitUser[];
  days: SplitDay[];
}

export interface Settlement {
  from: string; // user name
  to: string; // user name
  amount: number;
}

