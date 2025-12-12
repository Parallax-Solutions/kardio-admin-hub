import { DashboardService } from '@/api/generated/services/DashboardService';
import { unwrapData } from './http';

export async function getDashboardStats() {
  const response = await DashboardService.dashboardControllerGetStats();
  return unwrapData<unknown>(response);
}
