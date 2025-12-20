import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSuggestions,
  getPendingCount,
  acceptSuggestion,
  rejectSuggestion,
  runSimilarityJob,
} from '@/api/services/merchantSimilarityService';

// ============================================================================
// TYPES
// ============================================================================

export type SuggestionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface MerchantInfo {
  id: string;
  originalName: string;
  normalizedName: string;
  transactionCount: number;
  ruleCount: number;
}

export interface DuplicateSuggestion {
  id: string;
  similarityScore: number;
  status: SuggestionStatus;
  canonicalNameSnapshot: string;
  candidateNameSnapshot: string;
  resolvedByUserId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  canonicalMerchant: MerchantInfo;
  candidateMerchant: MerchantInfo;
}

export interface MergeResult {
  canonicalMerchantId: string;
  deletedMerchantId: string;
  transactionsUpdated: number;
  rulesUpdated: number;
  rulesDeduplicated: number;
  suggestionsResolved: number;
}

// ============================================================================
// QUERY KEYS
// ============================================================================

const QUERY_KEYS = {
  suggestions: (status: SuggestionStatus) => ['merchant-duplicates', 'suggestions', status] as const,
  pendingCount: ['merchant-duplicates', 'pending-count'] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

export const useDuplicateSuggestions = (status: SuggestionStatus = 'PENDING', limit = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions(status),
    queryFn: async () => {
      const response = await getSuggestions({ status, limit });
      // API returns wrapped response { data: [...] }
      const items = (response as unknown as { data?: unknown[] })?.data ?? response ?? [];
      return (items as typeof response).map((item) => ({
        id: item.id ?? '',
        similarityScore: item.similarityScore ?? 0,
        status: (item.status ?? 'PENDING') as SuggestionStatus,
        canonicalNameSnapshot: item.canonicalNameSnapshot ?? '',
        candidateNameSnapshot: item.candidateNameSnapshot ?? '',
        resolvedByUserId: item.resolvedByUserId ?? null,
        resolvedAt: item.resolvedAt ?? null,
        createdAt: item.createdAt ?? '',
        updatedAt: item.updatedAt ?? '',
        canonicalMerchant: {
          id: item.canonicalMerchant?.id ?? '',
          originalName: item.canonicalMerchant?.originalName ?? '',
          normalizedName: item.canonicalMerchant?.normalizedName ?? '',
          transactionCount: item.canonicalMerchant?.transactionCount ?? 0,
          ruleCount: item.canonicalMerchant?.ruleCount ?? 0,
        },
        candidateMerchant: {
          id: item.candidateMerchant?.id ?? '',
          originalName: item.candidateMerchant?.originalName ?? '',
          normalizedName: item.candidateMerchant?.normalizedName ?? '',
          transactionCount: item.candidateMerchant?.transactionCount ?? 0,
          ruleCount: item.candidateMerchant?.ruleCount ?? 0,
        },
      })) as DuplicateSuggestion[];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const usePendingCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.pendingCount,
    queryFn: async () => {
      const response = await getPendingCount();
      return response?.count ?? 0;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAcceptSuggestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: acceptSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-duplicates'] });
    },
  });
};

export const useRejectSuggestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-duplicates'] });
    },
  });
};

export const useRunSimilarityJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: runSimilarityJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-duplicates'] });
    },
  });
};
