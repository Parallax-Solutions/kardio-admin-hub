import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  useUsers, 
  useUpdateUserRole,
  useSetUsersFilters,
  useUsersFilters,
  type User,
  type UserRole,
} from '@/stores';
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
import { toast } from 'sonner';

export default function AdminUsers() {
  const { data: users = [], isLoading, error } = useUsers();
  const filters = useUsersFilters();
  const setFilters = useSetUsersFilters();
  const updateRole = useUpdateUserRole();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: User | null;
    newRole: UserRole | null;
  }>({ open: false, user: null, newRole: null });

  const handleRoleChange = (user: User, newRole: UserRole) => {
    if (newRole !== user.role) {
      setConfirmDialog({ open: true, user, newRole });
    }
  };

  const confirmRoleChange = async () => {
    if (confirmDialog.user && confirmDialog.newRole) {
      try {
        await updateRole.mutateAsync({ 
          id: confirmDialog.user.id, 
          role: confirmDialog.newRole 
        });
        toast.success('Rol actualizado');
      } catch {
        toast.error('Error al actualizar rol');
      }
    }
    setConfirmDialog({ open: false, user: null, newRole: null });
  };

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Users" description="Manage user accounts and roles" />

      {/* Filter */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Select 
          value={filters.role ?? 'all'} 
          onValueChange={(value) => setFilters({ role: value === 'all' ? null : value as UserRole })}
        >
          <SelectTrigger className="w-[120px] h-9 text-xs sm:w-[150px] sm:h-10 sm:text-sm">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
          </SelectContent>
        </Select>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Desktop Table */}
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
                    onValueChange={(value: UserRole) => handleRoleChange(user, value)}
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
                    onValueChange={(value: UserRole) => handleRoleChange(user, value)}
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
