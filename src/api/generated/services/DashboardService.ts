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
     * Returns aggregated spending statistics for the authenticated user, grouped by currency.
     *
     * **Optional Filters** (query params):
     * - `currency` - Filter transactions by currency code (e.g., USD, CRC). If not provided, returns stats for all currencies.
     * - `bankId` - Filter transactions by bank ID
     * - `connectionAccountId` - Filter transactions by connection account ID
     * - `categoryId` - Filter transactions by category ID
     * - `startDate` - Filter transactions from this date (ISO 8601, e.g., 2024-01-01)
     * - `endDate` - Filter transactions until this date (ISO 8601, e.g., 2024-12-31)
     *
     * **Response**: Array of stats objects, one per currency. Each object contains:
     * - `totalTransactions` - Count of transactions for this currency
     * - `categories` - List of categories used in transactions for this currency (id, name, color, icon)
     * - `totalSpent` - Sum of transaction amounts for this currency
     * - `currency` - Currency code (e.g., USD, CRC)
     * - `uncategorizedCount` - Count of transactions without category for this currency
     *
     * @param currency Filter by currency code
     * @param bankId Filter by bank ID
     * @param connectionAccountId Filter by connection account ID
     * @param categoryId Filter by category ID
     * @param startDate Filter transactions from this date (ISO 8601)
     * @param endDate Filter transactions until this date (ISO 8601)
     * @returns any Dashboard statistics grouped by currency
     * @throws ApiError
     */
    public static dashboardControllerGetStats(
        currency?: string,
        bankId?: string,
        connectionAccountId?: string,
        categoryId?: string,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            totalTransactions?: number;
            categories?: Array<{
                id?: string;
                name?: string;
                color?: string;
                icon?: string;
            }>;
            totalSpent?: number;
            currency?: string;
            uncategorizedCount?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/stats',
            query: {
                'currency': currency,
                'bankId': bankId,
                'connectionAccountId': connectionAccountId,
                'categoryId': categoryId,
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
}
