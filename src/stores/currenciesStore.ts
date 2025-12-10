import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { CurrenciesService } from '@/api/generated/services/CurrenciesService';
import { CurrencySynonymsService } from '@/api/generated/services/CurrencySynonymsService';
import type { CreateCurrencyDto } from '@/api/generated/models/CreateCurrencyDto';
import type { UpdateCurrencyStatusDto } from '@/api/generated/models/UpdateCurrencyStatusDto';
import type { BulkMapSynonymsDto } from '@/api/generated/models/BulkMapSynonymsDto';

// ============================================================================
// TYPES
// ============================================================================

export type CurrencyStatus = 'ACTIVE' | 'PENDING' | 'DEPRECATED';
export type CurrencySource = 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';
export type SynonymStatus = 'UNMAPPED' | 'MAPPED';
export type SynonymCreatedBy = 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';

export interface Currency {
  code: string;
  name: string;
  status: CurrencyStatus;
  source: CurrencySource;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencySynonym {
  id: string;
  rawLabel: string;
  normalizedLabel: string;
  status: SynonymStatus;
  currencyCode: string | null;
  occurrences: number;
  firstSeenAt: Date;
  lastSeenAt: Date;
  createdBy: SynonymCreatedBy;
  currency?: {
    code: string;
    name: string;
  } | null;
}

export interface CurrenciesFilters {
  search: string;
  status: CurrencyStatus | 'all';
  page: number;
  limit: number;
}

export interface SynonymsFilters {
  search: string;
  status: SynonymStatus | 'all';
  page: number;
  limit: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================================================
// ZUSTAND UI STATE
// ============================================================================

interface CurrenciesUIState {
  // Currencies filters
  currenciesFilters: CurrenciesFilters;
  setCurrenciesFilters: (filters: Partial<CurrenciesFilters>) => void;
  resetCurrenciesFilters: () => void;
  
  // Synonyms filters
  synonymsFilters: SynonymsFilters;
  setSynonymsFilters: (filters: Partial<SynonymsFilters>) => void;
  resetSynonymsFilters: () => void;
  
  // Selected items
  selectedCurrency: Currency | null;
  setSelectedCurrency: (currency: Currency | null) => void;
  selectedSynonym: CurrencySynonym | null;
  setSelectedSynonym: (synonym: CurrencySynonym | null) => void;
  
  // Bulk selection for synonyms
  selectedSynonymIds: string[];
  setSelectedSynonymIds: (ids: string[]) => void;
  toggleSynonymSelection: (id: string) => void;
  clearSynonymSelection: () => void;
}

const initialCurrenciesFilters: CurrenciesFilters = {
  search: '',
  status: 'all',
  page: 1,
  limit: 20,
};

const initialSynonymsFilters: SynonymsFilters = {
  search: '',
  status: 'all',
  page: 1,
  limit: 20,
};

export const useCurrenciesUIStore = create<CurrenciesUIState>((set) => ({
  // Currencies filters
  currenciesFilters: initialCurrenciesFilters,
  setCurrenciesFilters: (newFilters) =>
    set((state) => ({ 
      currenciesFilters: { ...state.currenciesFilters, ...newFilters } 
    })),
  resetCurrenciesFilters: () => set({ currenciesFilters: initialCurrenciesFilters }),
  
  // Synonyms filters
  synonymsFilters: initialSynonymsFilters,
  setSynonymsFilters: (newFilters) =>
    set((state) => ({ 
      synonymsFilters: { ...state.synonymsFilters, ...newFilters } 
    })),
  resetSynonymsFilters: () => set({ synonymsFilters: initialSynonymsFilters }),
  
  // Selected items
  selectedCurrency: null,
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  selectedSynonym: null,
  setSelectedSynonym: (synonym) => set({ selectedSynonym: synonym }),
  
  // Bulk selection
  selectedSynonymIds: [],
  setSelectedSynonymIds: (ids) => set({ selectedSynonymIds: ids }),
  toggleSynonymSelection: (id) =>
    set((state) => ({
      selectedSynonymIds: state.selectedSynonymIds.includes(id)
        ? state.selectedSynonymIds.filter((i) => i !== id)
        : [...state.selectedSynonymIds, id],
    })),
  clearSynonymSelection: () => set({ selectedSynonymIds: [] }),
}));

// ============================================================================
// TRANSFORMERS
// ============================================================================

const transformCurrency = (apiCurrency: {
  code?: string;
  name?: string;
  status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED';
  source?: 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';
  createdAt?: string;
  updatedAt?: string;
}): Currency => ({
  code: apiCurrency.code ?? '',
  name: apiCurrency.name ?? '',
  status: apiCurrency.status ?? 'PENDING',
  source: apiCurrency.source ?? 'MANUAL',
  createdAt: apiCurrency.createdAt ? new Date(apiCurrency.createdAt) : new Date(),
  updatedAt: apiCurrency.updatedAt ? new Date(apiCurrency.updatedAt) : new Date(),
});

const transformSynonym = (apiSynonym: {
  id?: string;
  rawLabel?: string;
  normalizedLabel?: string;
  status?: 'UNMAPPED' | 'MAPPED';
  currencyCode?: string | null;
  occurrences?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
  createdBy?: 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';
  currency?: { code?: string; name?: string } | null;
}): CurrencySynonym => ({
  id: apiSynonym.id ?? '',
  rawLabel: apiSynonym.rawLabel ?? '',
  normalizedLabel: apiSynonym.normalizedLabel ?? '',
  status: apiSynonym.status ?? 'UNMAPPED',
  currencyCode: apiSynonym.currencyCode ?? null,
  occurrences: apiSynonym.occurrences ?? 0,
  firstSeenAt: apiSynonym.firstSeenAt ? new Date(apiSynonym.firstSeenAt) : new Date(),
  lastSeenAt: apiSynonym.lastSeenAt ? new Date(apiSynonym.lastSeenAt) : new Date(),
  createdBy: apiSynonym.createdBy ?? 'AUTO_DETECT',
  currency: apiSynonym.currency
    ? { code: apiSynonym.currency.code ?? '', name: apiSynonym.currency.name ?? '' }
    : null,
});

// ============================================================================
// QUERY KEYS
// ============================================================================

export const currenciesKeys = {
  all: ['currencies'] as const,
  lists: () => [...currenciesKeys.all, 'list'] as const,
  list: (filters: CurrenciesFilters) => [...currenciesKeys.lists(), filters] as const,
  details: () => [...currenciesKeys.all, 'detail'] as const,
  detail: (code: string) => [...currenciesKeys.details(), code] as const,
  stats: () => [...currenciesKeys.all, 'stats'] as const,
};

export const synonymsKeys = {
  all: ['currency-synonyms'] as const,
  lists: () => [...synonymsKeys.all, 'list'] as const,
  list: (filters: SynonymsFilters) => [...synonymsKeys.lists(), filters] as const,
  unmapped: (filters: Omit<SynonymsFilters, 'status'>) => [...synonymsKeys.all, 'unmapped', filters] as const,
  byCurrency: (currencyCode: string) => [...synonymsKeys.all, 'by-currency', currencyCode] as const,
  details: () => [...synonymsKeys.all, 'detail'] as const,
  detail: (id: string) => [...synonymsKeys.details(), id] as const,
  stats: () => [...synonymsKeys.all, 'stats'] as const,
};

// ============================================================================
// CURRENCIES HOOKS
// ============================================================================

export function useCurrencies(filters?: Partial<CurrenciesFilters>) {
  const storeFilters = useCurrenciesUIStore((state) => state.currenciesFilters);
  const effectiveFilters = { ...storeFilters, ...filters };

  return useQuery({
    queryKey: currenciesKeys.list(effectiveFilters),
    queryFn: async () => {
      const response = await CurrenciesService.currenciesControllerFindAll(
        effectiveFilters.page,
        effectiveFilters.limit,
        effectiveFilters.search || undefined,
        effectiveFilters.status === 'all' ? undefined : effectiveFilters.status
      );
      
      return {
        data: (response.data ?? []).map(transformCurrency),
        pagination: response.pagination as PaginationInfo | undefined,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useCurrency(code: string | undefined) {
  return useQuery({
    queryKey: currenciesKeys.detail(code!),
    queryFn: async () => {
      const response = await CurrenciesService.currenciesControllerFindOne(code!);
      return response.data ? transformCurrency(response.data) : null;
    },
    enabled: !!code,
  });
}

export function useUpdateCurrencyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, status }: { code: string; status: CurrencyStatus }) =>
      CurrenciesService.currenciesControllerUpdateStatus(code, { 
        status: status as UpdateCurrencyStatusDto.status 
      }),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({ queryKey: currenciesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: currenciesKeys.detail(code) });
      queryClient.invalidateQueries({ queryKey: currenciesKeys.stats() });
    },
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCurrencyDto) =>
      CurrenciesService.currenciesControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currenciesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: currenciesKeys.stats() });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) =>
      CurrenciesService.currenciesControllerDelete(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currenciesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: currenciesKeys.stats() });
      queryClient.invalidateQueries({ queryKey: synonymsKeys.all });
    },
  });
}

export function useCurrenciesStats() {
  return useQuery({
    queryKey: currenciesKeys.stats(),
    queryFn: async () => {
      const response = await CurrenciesService.currenciesControllerGetStats();
      return response.data ?? { total: 0, byStatus: { ACTIVE: 0, PENDING: 0, DEPRECATED: 0 } };
    },
  });
}

// ============================================================================
// SYNONYMS HOOKS
// ============================================================================

export function useSynonyms(filters?: Partial<SynonymsFilters>) {
  const storeFilters = useCurrenciesUIStore((state) => state.synonymsFilters);
  const effectiveFilters = { ...storeFilters, ...filters };

  return useQuery({
    queryKey: synonymsKeys.list(effectiveFilters),
    queryFn: async () => {
      const response = await CurrencySynonymsService.currencySynonymsControllerFindAll(
        effectiveFilters.page,
        effectiveFilters.limit,
        effectiveFilters.search || undefined,
        effectiveFilters.status === 'all' ? undefined : effectiveFilters.status
      );
      
      return {
        data: (response.data ?? []).map(transformSynonym),
        pagination: response.pagination as PaginationInfo | undefined,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useUnmappedSynonyms(filters?: { search?: string; page?: number; limit?: number }) {
  const effectiveFilters = {
    search: filters?.search ?? '',
    page: filters?.page ?? 1,
    limit: filters?.limit ?? 20,
  };
  
  return useQuery({
    queryKey: synonymsKeys.unmapped(effectiveFilters),
    queryFn: async () => {
      const response = await CurrencySynonymsService.currencySynonymsControllerFindUnmapped(
        filters?.page ?? 1,
        filters?.limit ?? 20,
        filters?.search || undefined
      );
      
      return {
        data: (response.data ?? []).map(transformSynonym),
        pagination: response.pagination as PaginationInfo | undefined,
      };
    },
  });
}

export function useSynonymsByCurrency(currencyCode: string | undefined) {
  return useQuery({
    queryKey: synonymsKeys.byCurrency(currencyCode!),
    queryFn: async () => {
      const response = await CurrencySynonymsService.currencySynonymsControllerFindByCurrency(currencyCode!);
      return (response.data ?? []).map(transformSynonym);
    },
    enabled: !!currencyCode,
  });
}

export function useSynonym(id: string | undefined) {
  return useQuery({
    queryKey: synonymsKeys.detail(id!),
    queryFn: async () => {
      const response = await CurrencySynonymsService.currencySynonymsControllerFindOne(id!);
      return response.data ? transformSynonym(response.data) : null;
    },
    enabled: !!id,
  });
}

export function useMapSynonym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currencyCode }: { id: string; currencyCode: string }) =>
      CurrencySynonymsService.currencySynonymsControllerMapToCurrency(id, { currencyCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: synonymsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: synonymsKeys.all });
      queryClient.invalidateQueries({ queryKey: synonymsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: currenciesKeys.all });
    },
  });
}

export function useBulkMapSynonyms() {
  const queryClient = useQueryClient();
  const clearSelection = useCurrenciesUIStore((state) => state.clearSynonymSelection);

  return useMutation({
    mutationFn: (mappings: BulkMapSynonymsDto['mappings']) =>
      CurrencySynonymsService.currencySynonymsControllerBulkMap({ mappings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: synonymsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: synonymsKeys.all });
      queryClient.invalidateQueries({ queryKey: synonymsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: currenciesKeys.all });
      clearSelection();
    },
  });
}

export function useSynonymsStats() {
  return useQuery({
    queryKey: synonymsKeys.stats(),
    queryFn: async () => {
      const response = await CurrencySynonymsService.currencySynonymsControllerGetStats();
      return response.data ?? { total: 0, byStatus: { UNMAPPED: 0, MAPPED: 0 }, totalUnmappedOccurrences: 0 };
    },
  });
}

// ============================================================================
// SELECTORS
// ============================================================================

export const useCurrenciesFilters = () => useCurrenciesUIStore((state) => state.currenciesFilters);
export const useSetCurrenciesFilters = () => useCurrenciesUIStore((state) => state.setCurrenciesFilters);
export const useResetCurrenciesFilters = () => useCurrenciesUIStore((state) => state.resetCurrenciesFilters);

export const useSynonymsFilters = () => useCurrenciesUIStore((state) => state.synonymsFilters);
export const useSetSynonymsFilters = () => useCurrenciesUIStore((state) => state.setSynonymsFilters);
export const useResetSynonymsFilters = () => useCurrenciesUIStore((state) => state.resetSynonymsFilters);

export const useSelectedCurrency = () => useCurrenciesUIStore((state) => state.selectedCurrency);
export const useSetSelectedCurrency = () => useCurrenciesUIStore((state) => state.setSelectedCurrency);

export const useSelectedSynonym = () => useCurrenciesUIStore((state) => state.selectedSynonym);
export const useSetSelectedSynonym = () => useCurrenciesUIStore((state) => state.setSelectedSynonym);

export const useSelectedSynonymIds = () => useCurrenciesUIStore((state) => state.selectedSynonymIds);
export const useSetSelectedSynonymIds = () => useCurrenciesUIStore((state) => state.setSelectedSynonymIds);
export const useToggleSynonymSelection = () => useCurrenciesUIStore((state) => state.toggleSynonymSelection);
export const useClearSynonymSelection = () => useCurrenciesUIStore((state) => state.clearSynonymSelection);
