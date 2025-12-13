import { useUsers, useSetUsersFilters, useUsersFilters, type UserRole } from '@/stores';
import { useUserRoleChange } from './useUserRoleChange';

export function useUsersList() {
  const { data: users = [], isLoading, error } = useUsers();
  const filters = useUsersFilters();
  const setFilters = useSetUsersFilters();

  const roleChange = useUserRoleChange();

  const handleRoleFilterChange = (value: string) => {
    setFilters({ role: value === 'all' ? null : (value as UserRole) });
  };

  return {
    // Data
    users,
    isLoading,
    error,
    filters,
    // Actions
    handleRoleFilterChange,
    // Role change hook (spread all properties)
    ...roleChange,
  };
}
