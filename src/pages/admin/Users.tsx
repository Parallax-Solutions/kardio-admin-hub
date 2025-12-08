import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { PageHeader } from '@/components/admin/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Users" description="Manage user accounts and roles" />

      {/* Filter */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[120px] h-9 text-xs sm:w-[150px] sm:h-10 sm:text-sm">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead className="hidden lg:table-cell">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
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
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Select
                    value={user.role}
                    onValueChange={(value: 'ADMIN' | 'CLIENT') => handleRoleChange(user, value)}
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

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <Card key={user.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                      className={`text-[10px] ${user.role === 'ADMIN' ? 'bg-primary' : ''}`}
                    >
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[10px] text-muted-foreground">{user.createdAt}</span>
                  <Select
                    value={user.role}
                    onValueChange={(value: 'ADMIN' | 'CLIENT') => handleRoleChange(user, value)}
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
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, user: null, newRole: null })}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Change User Role?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              You are about to change <strong>{confirmDialog.user?.email}</strong>'s role from{' '}
              <strong>{confirmDialog.user?.role}</strong> to <strong>{confirmDialog.newRole}</strong>.
              {confirmDialog.newRole === 'ADMIN' && (
                <span className="mt-2 block text-warning">
                  Warning: This will grant administrative privileges to this user.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="text-xs sm:text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} className="text-xs sm:text-sm">
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
