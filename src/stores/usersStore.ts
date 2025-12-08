import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '@/api/generated/services/UsersService';
import { UpdateUserRoleDto } from '@/api/generated/models/UpdateUserRoleDto';
import { useMemo } from 'react';

// Tipos UI
export type UserRole = 'CLIENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UsersFilters {
  search: string;
  role: UserRole | null;
}

// Zustand solo para UI state
interface UsersUIState {
  filters: UsersFilters;
  selectedUser: User | null;
  setFilters: (filters: Partial<UsersFilters>) => void;
  resetFilters: () => void;
  setSelectedUser: (user: User | null) => void;
}

const initialFilters: UsersFilters = {
  search: '',
  role: null,
};

export const useUsersUIStore = create<UsersUIState>((set) => ({
  filters: initialFilters,
  selectedUser: null,

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),

  setSelectedUser: (user) => set({ selectedUser: user }),
}));

// Transformar response API → modelo UI
const transformUser = (apiUser: Record<string, unknown>): User => ({
  id: (apiUser.id as string) ?? '',
  email: (apiUser.email as string) ?? '',
  name: (apiUser.name as string) ?? '',
  role: (apiUser.role as UserRole) ?? 'CLIENT',
  image: (apiUser.image as string) ?? null,
  createdAt: (apiUser.createdAt as string) ?? null,
  updatedAt: (apiUser.updatedAt as string) ?? null,
});

// Filtrar usuarios localmente (API no soporta filtros)
const filterUsers = (users: User[], filters: UsersFilters): User[] => {
  let filtered = [...users];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  if (filters.role) {
    filtered = filtered.filter((user) => user.role === filters.role);
  }

  return filtered;
};

// Query Keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: () => [...usersKeys.lists()] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

// TanStack Query Hooks
export function useUsers() {
  const filters = useUsersUIStore((state) => state.filters);

  const query = useQuery({
    queryKey: usersKeys.list(),
    queryFn: async () => {
      const response = await UsersService.usersControllerFindAll();
      const data = response?.data ?? response ?? [];
      return Array.isArray(data) ? data.map(transformUser) : [];
    },
  });

  // Filtrar localmente ya que la API no soporta filtros
  const filteredData = useMemo(() => {
    if (!query.data) return [];
    return filterUsers(query.data, filters);
  }, [query.data, filters]);

  return {
    ...query,
    data: filteredData,
    allUsers: query.data ?? [],
  };
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: usersKeys.detail(id!),
    queryFn: async () => {
      const response = await UsersService.usersControllerFindOne(id!);
      const data = response?.data ?? response;
      return data ? transformUser(data as Record<string, unknown>) : null;
    },
    enabled: !!id,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => {
      const dto: UpdateUserRoleDto = {
        role: role as UpdateUserRoleDto.role,
      };
      return UsersService.usersControllerUpdateRole(id, dto);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
    },
  });
}

// Selectores UI
export const useUsersFilters = () => useUsersUIStore((state) => state.filters);
export const useSelectedUser = () => useUsersUIStore((state) => state.selectedUser);
export const useSetUsersFilters = () => useUsersUIStore((state) => state.setFilters);
export const useResetUsersFilters = () => useUsersUIStore((state) => state.resetFilters);
export const useSetSelectedUser = () => useUsersUIStore((state) => state.setSelectedUser);

// Hook para estadísticas (derivado de useUsers)
export function useUsersStats() {
  const { allUsers } = useUsers();

  return useMemo(() => ({
    total: allUsers.length,
    admins: allUsers.filter((u) => u.role === 'ADMIN').length,
    clients: allUsers.filter((u) => u.role === 'CLIENT').length,
  }), [allUsers]);
}
