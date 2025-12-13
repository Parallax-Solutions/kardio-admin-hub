import { PageHeader } from '@/components/admin/PageHeader';
import { useUsersList } from '@/hooks/useUsersList';
import { UsersTable, UserCard, RoleChangeDialog, UsersFilters } from '@/components/admin/users';

export default function AdminUsers() {
  const {
    users,
    isLoading,
    error,
    filters,
    handleRoleFilterChange,
    confirmDialog,
    handleRoleChange,
    confirmRoleChange,
    closeDialog,
  } = useUsersList();

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Users" description="Manage user accounts and roles" />

      <UsersFilters
        filters={filters}
        isLoading={isLoading}
        onRoleFilterChange={handleRoleFilterChange}
      />

      <UsersTable users={users} onRoleChange={handleRoleChange} />

      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onRoleChange={handleRoleChange} />
        ))}
      </div>

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
