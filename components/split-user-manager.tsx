'use client';

import { useState } from 'react';
import { SplitUser } from '@/lib/split-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SplitUserManagerProps {
  users: SplitUser[];
  onAddUser: (name: string) => void;
  onRemoveUser: (id: string) => void;
}

export function SplitUserManager({ users, onAddUser, onRemoveUser }: SplitUserManagerProps) {
  const [newUserName, setNewUserName] = useState('');

  const handleAdd = () => {
    if (newUserName.trim()) {
      onAddUser(newUserName.trim());
      setNewUserName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>People</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter person's name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add people to start splitting expenses
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Badge key={user.id} variant="secondary" className="text-sm px-3 py-1">
                {user.name}
                <button
                  onClick={() => onRemoveUser(user.id)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

