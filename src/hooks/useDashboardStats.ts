import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBanks, useUsers, useParserConfigs } from '@/stores';
import { getTransactionSummary } from '@/api/services/transactionsService';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalBanks: number;
  totalParserConfigs: number;
  transactionsLast7Days: number;
  emailsIngestedLast7Days: number;
}

export interface ActivityData {
  date: string;
  transactions: number;
  emails: number;
}

export function useDashboardStats() {
  const { data: banks = [], isLoading: banksLoading } = useBanks();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: parserConfigs = [], isLoading: configsLoading } = useParserConfigs();

  // Calculate date range for last 7 days
  const dateRange = useMemo(() => {
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, 7));
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  // Fetch transaction stats
  const { data: transactionStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats', 'transactions', dateRange],
    queryFn: () => getTransactionSummary({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }),
  });

  const isLoading = banksLoading || usersLoading || configsLoading || statsLoading;

  const stats = useMemo<DashboardStats>(() => {
    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => u.role === 'ADMIN').length;
    const activeBanks = banks.filter((b) => b.isActive).length;
    const totalParserConfigs = parserConfigs.length;

    return {
      totalUsers,
      totalAdmins,
      totalBanks: activeBanks,
      totalParserConfigs,
      transactionsLast7Days: transactionStats?.totalCount ?? 0,
      emailsIngestedLast7Days: 0, // Not available in API yet
    };
  }, [banks, users, parserConfigs, transactionStats]);

  // Activity data would come from a real analytics endpoint
  // For now, return empty array - can be populated when backend provides this
  const activityData: ActivityData[] = useMemo(() => [], []);

  return {
    stats,
    activityData,
    isLoading,
  };
}
