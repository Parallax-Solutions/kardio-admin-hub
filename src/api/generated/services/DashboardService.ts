/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardService {
    /**
     * Get dashboard statistics
     *
     * Returns aggregated spending statistics for the authenticated user.
     *
     * **Includes**:
     * - Total spending (current month)
     * - Transaction count
     * - Spending by category breakdown
     * - Monthly spending trends
     * - Top merchants
     *
     * @returns any Dashboard statistics
     * @throws ApiError
     */
    public static dashboardControllerGetStats(): CancelablePromise<{
        success?: boolean;
        data?: {
            totalSpending?: number;
            transactionCount?: number;
            spendingByCategory?: Array<{
                categoryId?: string;
                categoryName?: string;
                total?: number;
                percentage?: number;
            }>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/stats',
        });
    }
}
