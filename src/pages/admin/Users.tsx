import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { PageHeader } from '@/components/admin/PageHeader';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@/data/mockData';

export default function AdminUsers() {
  const { users, roleFilter, setRoleFilter, updateUserRole } = useAdminUsers();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: User | null;
    newRole: 'ADMIN' | 'CLIENT' | null;
  }>({ open: false, user: null, newRole: null });

  const handleRoleChange = (user: User, newRole: 'ADMIN' | 'CLIENT') => {
    if (newRole !== user.role) {
      setConfirmDialog({ open: true, user, newRole });
    }
  };

  const confirmRoleChange = () => {
    if (confirmDialog.user && confirmDialog.newRole) {
      updateUserRole(confirmDialog.user.id, confirmDialog.newRole);
    }
    setConfirmDialog({ open: false, user: null, newRole: null });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-success/10 text-success border-success/20',
      inactive: 'bg-muted text-muted-foreground',
      pending: 'bg-warning/10 text-warning border-warning/20',
    };
    return styles[status] || '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users" description="Manage user accounts and roles" />

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">{user.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                    className={user.role === 'ADMIN' ? 'bg-primary' : ''}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Select
                    value={user.role}
                    onValueChange={(value: 'ADMIN' | 'CLIENT') => handleRoleChange(user, value)}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
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

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, user: null, newRole: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change <strong>{confirmDialog.user?.email}</strong>'s role from{' '}
              <strong>{confirmDialog.user?.role}</strong> to <strong>{confirmDialog.newRole}</strong>.
              {confirmDialog.newRole === 'ADMIN' && (
                <span className="mt-2 block text-warning">
                  Warning: This will grant administrative privileges to this user.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
