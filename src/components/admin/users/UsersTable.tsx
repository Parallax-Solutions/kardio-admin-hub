import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, UserRole } from '@/stores';

interface UsersTableProps {
  users: User[];
  onRoleChange: (user: User, newRole: UserRole) => void;
}

export function UsersTable({ users, onRoleChange }: UsersTableProps) {
  return (
    <div className="hidden rounded-xl border bg-card shadow-card md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="hidden lg:table-cell">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden lg:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group">
              <TableCell className="max-w-[200px] truncate font-medium">{user.email}</TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">{user.name}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                  className={user.role === 'ADMIN' ? 'bg-primary text-xs' : 'text-xs'}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) => onRoleChange(user, value)}
                >
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
