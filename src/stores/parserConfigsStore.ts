import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParserConfigsService } from '@/api/generated/services/ParserConfigsService';
import type { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';
import type { UpdateParserConfigDto } from '@/api/generated/models/UpdateParserConfigDto';
import type { TestParserConfigDto } from '@/api/generated/models/TestParserConfigDto';

// Tipos UI
export type ParserStrategy = 'RULE_BASED' | 'AI' | 'HYBRID';
export enum EmailKind {
  TRANSACTION_NOTIFICATION = 'TRANSACTION_NOTIFICATION',
  ACCOUNT_STATEMENT = 'ACCOUNT_STATEMENT',
  SUBSCRIPTION_NOTIFICATION = 'SUBSCRIPTION_NOTIFICATION',
}

export interface ParserConfig {
  id: string;
  bankId: string;
  version: string;
  strategy: ParserStrategy;
  emailKind: EmailKind;
  isActive: boolean;
  emailSenderPatterns: string[];
  subjectPatterns: string[];
  rules: Record<string, unknown> | null;
  aiConfig: Record<string, unknown> | null;
  sampleEmailHtml: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TestParserResult {
  success: boolean;
  extractedData?: Record<string, unknown>;
  errors?: string[];
}

export interface ParserConfigsFilters {
  search: string;
  bankId: string | null;
  active: boolean | null;
  sortBy: 'name' | 'bankId' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// Zustand solo para UI state
interface ParserConfigsUIState {
  filters: ParserConfigsFilters;
  selectedConfig: ParserConfig | null;
  testResult: TestParserResult | null;
  setFilters: (filters: Partial<ParserConfigsFilters>) => void;
  resetFilters: () => void;
  setSelectedConfig: (config: ParserConfig | null) => void;
  setTestResult: (result: TestParserResult | null) => void;
  clearTestResult: () => void;
}

const initialFilters: ParserConfigsFilters = {
  search: '',
  bankId: null,
  active: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useParserConfigsUIStore = create<ParserConfigsUIState>((set) => ({
  filters: initialFilters,
  selectedConfig: null,
  testResult: null,

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),

  setSelectedConfig: (config) => set({ selectedConfig: config }),

  setTestResult: (result) => set({ testResult: result }),

  clearTestResult: () => set({ testResult: null }),
}));

// Transformar response API → modelo UI
const transformConfig = (apiConfig: Record<string, unknown>): ParserConfig => {
  const rawEmailKind = apiConfig.emailKind as string;
  const emailKind = Object.values(EmailKind).includes(rawEmailKind as EmailKind)
    ? (rawEmailKind as EmailKind)
    : EmailKind.TRANSACTION_NOTIFICATION;

  return {
    id: (apiConfig.id as string) ?? '',
    bankId: (apiConfig.bankId as string) ?? '',
    version: (apiConfig.version as string) ?? '1.0.0',
    strategy: (apiConfig.strategy as ParserStrategy) ?? 'RULE_BASED',
    emailKind,
    isActive: (apiConfig.isActive as boolean) ?? false,
    emailSenderPatterns: (apiConfig.emailSenderPatterns as string[]) ?? [],
    subjectPatterns: (apiConfig.subjectPatterns as string[]) ?? [],
    rules: (apiConfig.rules as Record<string, unknown>) ?? null,
    aiConfig: (apiConfig.aiConfig as Record<string, unknown>) ?? null,
    sampleEmailHtml: (apiConfig.sampleEmailHtml as string) ?? null,
    createdAt: (apiConfig.createdAt as string) ?? null,
    updatedAt: (apiConfig.updatedAt as string) ?? null,
  };
};

// Query Keys
export const parserConfigsKeys = {
  all: ['parserConfigs'] as const,
  lists: () => [...parserConfigsKeys.all, 'list'] as const,
  list: (filters: ParserConfigsFilters) => [...parserConfigsKeys.lists(), filters] as const,
  details: () => [...parserConfigsKeys.all, 'detail'] as const,
  detail: (id: string) => [...parserConfigsKeys.details(), id] as const,
  activeByBank: (bankId: string) => [...parserConfigsKeys.all, 'activeByBank', bankId] as const,
};

// TanStack Query Hooks
export function useParserConfigs(filters?: Partial<ParserConfigsFilters>) {
  const storeFilters = useParserConfigsUIStore((state) => state.filters);
  const activeFilters = { ...storeFilters, ...filters };

  return useQuery({
    queryKey: parserConfigsKeys.list(activeFilters),
    queryFn: async () => {
      const response = await ParserConfigsService.parserConfigsControllerFindAll(
        activeFilters.sortBy,
        activeFilters.sortOrder,
        activeFilters.bankId ?? undefined,
        activeFilters.active ?? undefined,
        activeFilters.search || undefined
      );
      const data = response?.data ?? response ?? [];
      return Array.isArray(data) ? data.map(transformConfig) : [];
    },
  });
}

export function useParserConfig(id: string | undefined) {
  return useQuery({
    queryKey: parserConfigsKeys.detail(id!),
    queryFn: async () => {
      const response = await ParserConfigsService.parserConfigsControllerFindOne(id!);
      const data = response?.data ?? response;
      return data ? transformConfig(data as Record<string, unknown>) : null;
    },
    enabled: !!id,
  });
}

export function useActiveParserConfigByBank(bankId: string | undefined) {
  return useQuery({
    queryKey: parserConfigsKeys.activeByBank(bankId!),
    queryFn: async () => {
      const response = await ParserConfigsService.parserConfigsControllerFindActiveByBank(bankId!);
      const data = response?.data ?? response;
      return data ? transformConfig(data as Record<string, unknown>) : null;
    },
    enabled: !!bankId,
  });
}

export function useCreateParserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParserConfigDto) =>
      ParserConfigsService.parserConfigsControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.lists() });
    },
  });
}

export function useUpdateParserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParserConfigDto }) =>
      ParserConfigsService.parserConfigsControllerUpdate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.detail(id) });
    },
  });
}

export function useDeleteParserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ParserConfigsService.parserConfigsControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.lists() });
    },
  });
}

export function useActivateParserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ParserConfigsService.parserConfigsControllerActivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.all });
    },
  });
}

export function useDeactivateParserConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ParserConfigsService.parserConfigsControllerDeactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: parserConfigsKeys.detail(id) });
    },
  });
}

export function useTestParser() {
  const setTestResult = useParserConfigsUIStore((state) => state.setTestResult);

  return useMutation({
    mutationFn: (data: TestParserConfigDto) =>
      ParserConfigsService.parserConfigsControllerTestParser(data),
    onSuccess: (response) => {
      const result: TestParserResult = {
        success: response?.success ?? false,
        extractedData: response?.data as Record<string, unknown>,
        errors: response?.errors as string[],
      };
      setTestResult(result);
    },
  });
}

// Selectores UI
export const useParserConfigsFilters = () => useParserConfigsUIStore((state) => state.filters);
export const useSelectedParserConfig = () => useParserConfigsUIStore((state) => state.selectedConfig);
export const useTestParserResult = () => useParserConfigsUIStore((state) => state.testResult);
export const useSetParserConfigsFilters = () => useParserConfigsUIStore((state) => state.setFilters);
export const useResetParserConfigsFilters = () => useParserConfigsUIStore((state) => state.resetFilters);
export const useSetSelectedParserConfig = () => useParserConfigsUIStore((state) => state.setSelectedConfig);
export const useClearTestResult = () => useParserConfigsUIStore((state) => state.clearTestResult);
