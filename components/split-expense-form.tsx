'use client';

import { useState } from 'react';
import { SplitUser } from '@/lib/split-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SplitExpenseFormProps {
  users: SplitUser[];
  dayId: string;
  onAdd: (expense: {
    description: string;
    amount: number;
    category: string;
    paidBy: string;
    splitAmong: string[];
  }) => void;
}

const SPLIT_CATEGORIES = [
  'Transport',
  'Food',
  'Accommodation',
  'Entertainment',
  'Shopping',
  'Activities',
  'Other',
];

export function SplitExpenseForm({ users, dayId, onAdd }: SplitExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !paidBy || splitAmong.length === 0) {
      alert('Please fill all fields');
      return;
    }

    onAdd({
      description,
      amount: parseFloat(amount),
      category,
      paidBy,
      splitAmong,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('Food');
    setSplitAmong([]);
  };

  const toggleUser = (userId: string) => {
    setSplitAmong((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSplitAmong(users.map((u) => u.id));
  };

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Add people first to start adding expenses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              placeholder="e.g., Taxi to airport"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPLIT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paid By */}
          <div>
            <Label>Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Among */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split Among</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAll}
              >
                Select All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={splitAmong.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

