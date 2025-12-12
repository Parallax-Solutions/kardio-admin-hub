import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, UserRole } from '@/stores';

interface UserCardProps {
  user: User;
  onRoleChange: (user: User, newRole: UserRole) => void;
}

export function UserCard({ user, onRoleChange }: UserCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
            <Badge
              variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
              className={`text-[10px] ${user.role === 'ADMIN' ? 'bg-primary' : ''}`}
            >
              {user.role}
            </Badge>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-[10px] text-muted-foreground">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
            </span>
            <Select
              value={user.role}
              onValueChange={(value: UserRole) => onRoleChange(user, value)}
            >
              <SelectTrigger className="w-[90px] h-7 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
