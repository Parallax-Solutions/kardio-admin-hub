import { useMemo } from 'react';
import { useBanks, useUsers, useParserConfigs } from '@/stores';

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

  const isLoading = banksLoading || usersLoading || configsLoading;

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
      // These would come from a real analytics endpoint in production
      transactionsLast7Days: 0,
      emailsIngestedLast7Days: 0,
    };
  }, [banks, users, parserConfigs]);

  // Activity data would come from a real analytics endpoint
  // For now, return empty array - can be populated when backend provides this
  const activityData: ActivityData[] = useMemo(() => [], []);

  return {
    stats,
    activityData,
    isLoading,
  };
}
