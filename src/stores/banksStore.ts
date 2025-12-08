import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BanksService } from '@/api/generated/services/BanksService';
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
      const response = await BanksService.banksControllerFindAll(
        'name',
        'asc',
        undefined,
        undefined,
        undefined
      );
      console.log('Banks response:', response);
      return (response.data ?? []).map(transformBank);
    },
  });
}

export function useBank(id: string | undefined) {
  return useQuery({
    queryKey: banksKeys.detail(id!),
    queryFn: async () => {
      const response = await BanksService.banksControllerFindOne(id!);
      return response.data ? transformBank(response.data) : null;
    },
    enabled: !!id,
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankDto) => BanksService.banksControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
}

export function useUpdateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBankDto }) =>
      BanksService.banksControllerUpdate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: banksKeys.detail(id) });
    },
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BanksService.banksControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
}

export function useToggleBankActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BanksService.banksControllerToggleActive(id),
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
