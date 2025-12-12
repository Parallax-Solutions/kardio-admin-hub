import { Loader2 } from 'lucide-react';
import { 
  useUsers, 
  useSetUsersFilters,
  useUsersFilters,
  type UserRole,
} from '@/stores';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useUserRoleChange } from '@/hooks/useUserRoleChange';
import { UsersTable, UserCard, RoleChangeDialog } from '@/components/admin/users';

export default function AdminUsers() {
  const { data: users = [], isLoading, error } = useUsers();
  const filters = useUsersFilters();
  const setFilters = useSetUsersFilters();

  const {
    confirmDialog,
    handleRoleChange,
    confirmRoleChange,
    closeDialog,
  } = useUserRoleChange();

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
      <UsersTable users={users} onRoleChange={handleRoleChange} />

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onRoleChange={handleRoleChange} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <RoleChangeDialog
        open={confirmDialog.open}
        user={confirmDialog.user}
        newRole={confirmDialog.newRole}
        onClose={closeDialog}
        onConfirm={confirmRoleChange}
      />
    </div>
  );
}
