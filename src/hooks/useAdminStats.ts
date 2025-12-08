import { useState } from 'react';
import { mockStats, mockActivityData, AdminStats, ActivityData } from '@/data/mockData';

export function useAdminStats() {
  const [stats] = useState<AdminStats>(mockStats);
  const [activityData] = useState<ActivityData[]>(mockActivityData);
  const [isLoading] = useState(false);

  return {
    stats,
    activityData,
    isLoading,
  };
}
