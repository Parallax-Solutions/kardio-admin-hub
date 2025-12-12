import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listBanks, getBank, createBank, updateBank, deleteBank, toggleBankActive } from '@/api/services/banksService';
import type { CreateBankDto } from '@/api/generated/models/CreateBankDto';
import type { UpdateBankDto } from '@/api/generated/models/UpdateBankDto';

// Tipos UI (transformados desde API)
export interface Bank {
  id: string;
  name: string;
  slug: string;
  country: string;
  emailDomains: string[];
  isActive: boolean;
}

export interface BanksFilters {
  search: string;
  country: string | null;
  active: boolean | null;
  sortBy: 'name' | 'country' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// Zustand solo para UI state
interface BanksUIState {
  filters: BanksFilters;
  selectedBank: Bank | null;
  setFilters: (filters: Partial<BanksFilters>) => void;
  resetFilters: () => void;
  setSelectedBank: (bank: Bank | null) => void;
}

const initialFilters: BanksFilters = {
  search: '',
  country: null,
  active: null,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const useBanksUIStore = create<BanksUIState>((set) => ({
  filters: initialFilters,
  selectedBank: null,

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),

  setSelectedBank: (bank) => set({ selectedBank: bank }),
}));

// Transformar response API → modelo UI
const transformBank = (apiBank: {
  id?: string;
  name?: string;
  slug?: string;
  country?: string;
  emailDomains?: string[];
  isActive?: boolean;
}): Bank => ({
  id: apiBank.id ?? '',
  name: apiBank.name ?? '',
  slug: apiBank.slug ?? '',
  country: apiBank.country ?? '',
  emailDomains: apiBank.emailDomains ?? [],
  isActive: apiBank.isActive ?? false,
});

// Query Keys
export const banksKeys = {
  all: ['banks'] as const,
  lists: () => [...banksKeys.all, 'list'] as const,
  list: (filters: BanksFilters) => [
    ...banksKeys.lists(),
    filters.search,
    filters.country,
    filters.active,
    filters.sortBy,
    filters.sortOrder,
  ] as const,
  details: () => [...banksKeys.all, 'detail'] as const,
  detail: (id: string) => [...banksKeys.details(), id] as const,
};

// TanStack Query Hooks
export function useBanks() {
  return useQuery({
    queryKey: ['banks', 'list'],
    queryFn: async () => {
      const response = await listBanks({ sortBy: 'name', sortOrder: 'asc' });
      const data = (response as { data?: unknown[] })?.data ?? response ?? [];
      return Array.isArray(data) ? data.map((b) => transformBank(b as any)) : [];
    },
  });
}

export function useBank(id: string | undefined) {
  return useQuery({
    queryKey: banksKeys.detail(id!),
    queryFn: async () => {
      const response = await getBank(id!);
      const data = (response as any)?.data ?? response;
      return data ? transformBank(data as any) : null;
    },
    enabled: !!id,
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankDto) => createBank(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
}

export function useUpdateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBankDto }) =>
      updateBank(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: banksKeys.detail(id) });
    },
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
}

export function useToggleBankActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleBankActive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: banksKeys.detail(id) });
    },
  });
}

// Selectores UI
export const useBanksFilters = () => useBanksUIStore((state) => state.filters);
export const useSelectedBank = () => useBanksUIStore((state) => state.selectedBank);
export const useSetBanksFilters = () => useBanksUIStore((state) => state.setFilters);
export const useResetBanksFilters = () => useBanksUIStore((state) => state.resetFilters);
export const useSetSelectedBank = () => useBanksUIStore((state) => state.setSelectedBank);
