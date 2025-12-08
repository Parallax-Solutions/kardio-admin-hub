import { useState, useMemo } from 'react';
import { mockUsers, User } from '@/data/mockData';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'all') return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  const updateUserRole = (id: string, role: 'ADMIN' | 'CLIENT') => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role } : user))
    );
  };

  return {
    users: filteredUsers,
    roleFilter,
    setRoleFilter,
    isLoading,
    updateUserRole,
  };
}
