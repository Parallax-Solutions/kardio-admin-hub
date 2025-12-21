import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReports,
  approveReport,
  rejectReport,
  type ReportStatus,
} from '@/api/services/categoryUserReportsService';

// ============================================================================
// TYPES
// ============================================================================

export interface CategoryUserReport {
  id: string;
  userId: string;
  transactionId: string;
  merchantId: string;
  merchantNameSnapshot: string;
  currentCategoryIdSnapshot: string | null;
  requestedCategoryId: string;
  userNote: string | null;
  status: ReportStatus;
  resolvedByAdminUserId: string | null;
  resolvedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveResult {
  report: CategoryUserReport;
  globalRuleUpdated: boolean;
  userRuleDeleted: boolean;
  transactionsUpdated: number;
}

// ============================================================================
// QUERY KEYS
// ============================================================================

const QUERY_KEYS = {
  reports: (status: ReportStatus, limit: number, offset: number) => 
    ['category-user-reports', status, limit, offset] as const,
  allReports: ['category-user-reports'] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

export const useCategoryUserReports = (
  status: ReportStatus = 'PENDING',
  limit = 50,
  offset = 0
) => {
  return useQuery({
    queryKey: QUERY_KEYS.reports(status, limit, offset),
    queryFn: async () => {
      const response = await getReports({ status, limit, offset });
      return {
        reports: (response.reports ?? []).map((item) => ({
          id: item.id ?? '',
          userId: item.userId ?? '',
          transactionId: item.transactionId ?? '',
          merchantId: item.merchantId ?? '',
          merchantNameSnapshot: item.merchantNameSnapshot ?? '',
          currentCategoryIdSnapshot: item.currentCategoryIdSnapshot ?? null,
          requestedCategoryId: item.requestedCategoryId ?? '',
          userNote: item.userNote ?? null,
          status: (item.status ?? 'PENDING') as ReportStatus,
          resolvedByAdminUserId: item.resolvedByAdminUserId ?? null,
          resolvedAt: item.resolvedAt ?? null,
          resolutionNote: item.resolutionNote ?? null,
          createdAt: item.createdAt ?? '',
          updatedAt: item.updatedAt ?? '',
        })) as CategoryUserReport[],
        total: response.total ?? 0,
      };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useApproveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolutionNote }: { id: string; resolutionNote?: string }) =>
      approveReport(id, { resolutionNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allReports });
    },
  });
};

export const useRejectReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolutionNote }: { id: string; resolutionNote: string }) =>
      rejectReport(id, { resolutionNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allReports });
    },
  });
};
