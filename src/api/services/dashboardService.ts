import { DashboardService } from '@/api/generated/services/DashboardService';
import { unwrapData } from './http';

export async function getDashboardStats(filters: {
  currency?: string;
  bankId?: string;
  connectionAccountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  const response = await DashboardService.dashboardControllerGetStats(
    filters.currency,
    filters.bankId,
    filters.connectionAccountId,
    filters.categoryId,
    filters.startDate,
    filters.endDate
  );
  return unwrapData<unknown>(response);
}
