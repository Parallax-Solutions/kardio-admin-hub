/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCurrencyDto } from '../models/CreateCurrencyDto';
import type { UpdateCurrencyStatusDto } from '../models/UpdateCurrencyStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CurrenciesService {
    /**
     * Get all currencies (paginated)
     *
     * Returns paginated currencies with search and filter support.
     *
     * **Pagination**:
     * - `page`: Page number (default: 1)
     * - `limit`: Items per page (default: 20, max: 100)
     *
     * **Filters**:
     * - `search`: Search by code or name (partial match, case-insensitive)
     * - `status`: Filter by status (ACTIVE, PENDING, DEPRECATED)
     *
     * **Response**: Paginated array of currencies ordered by code.
     *
     * @param page Page number (1-indexed)
     * @param limit Number of items per page
     * @param search Search by currency code or name (partial match, case-insensitive)
     * @param status Filter by status
     * @returns any Paginated list of currencies
     * @throws ApiError
     */
    public static currenciesControllerFindAll(
        page: number = 1,
        limit: number = 20,
        search?: string,
        status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED',
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            code?: string;
            name?: string;
            status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED';
            source?: 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';
            createdAt?: string;
            updatedAt?: string;
        }>;
        pagination?: {
            page?: number;
            limit?: number;
            totalItems?: number;
            totalPages?: number;
            hasNext?: boolean;
            hasPrev?: boolean;
        };
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/currencies',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'status': status,
            },
        });
    }
    /**
     * Create a new currency
     *
     * Creates a new currency in the system.
     *
     * **Required fields**:
     * - `code`: ISO 4217 currency code (3 uppercase letters)
     * - `name`: Currency name
     *
     * **Optional fields**:
     * - `status`: Initial status (default: ACTIVE)
     *
     * @param requestBody
     * @returns any Currency created successfully
     * @throws ApiError
     */
    public static currenciesControllerCreate(
        requestBody: CreateCurrencyDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            code?: string;
            name?: string;
            status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED';
            source?: 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';
            createdAt?: string;
            updatedAt?: string;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/currencies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Currency already exists`,
            },
        });
    }
    /**
     * Get currency statistics
     *
     * Returns aggregated statistics about currencies.
     *
     * **Response includes**:
     * - `total`: Total number of currencies
     * - `byStatus`: Count of currencies by status (ACTIVE, PENDING, DEPRECATED)
     *
     * @returns any Currency statistics
     * @throws ApiError
     */
    public static currenciesControllerGetStats(): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            total?: number;
            byStatus?: {
                ACTIVE?: number;
                PENDING?: number;
                DEPRECATED?: number;
            };
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/currencies/stats',
        });
    }
    /**
     * Get currency by code
     * Returns a single currency by its ISO 4217 code.
     * @param code
     * @returns any Currency details
     * @throws ApiError
     */
    public static currenciesControllerFindOne(
        code: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            code?: string;
            name?: string;
            status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED';
            source?: 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';
            createdAt?: string;
            updatedAt?: string;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/currencies/{code}',
            path: {
                'code': code,
            },
            errors: {
                404: `Currency not found`,
            },
        });
    }
    /**
     * Delete a currency
     * Permanently deletes a currency. This action cannot be undone.
     * @param code
     * @returns any Currency deleted successfully
     * @throws ApiError
     */
    public static currenciesControllerDelete(
        code: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: null | null;
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/currencies/{code}',
            path: {
                'code': code,
            },
            errors: {
                404: `Currency not found`,
            },
        });
    }
    /**
     * Update currency status
     * Updates the status of a currency (ACTIVE, PENDING, DEPRECATED).
     * @param code
     * @param requestBody
     * @returns any Currency status updated
     * @throws ApiError
     */
    public static currenciesControllerUpdateStatus(
        code: string,
        requestBody: UpdateCurrencyStatusDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            code?: string;
            name?: string;
            status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED';
            source?: 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';
            createdAt?: string;
            updatedAt?: string;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/currencies/{code}/status',
            path: {
                'code': code,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Currency not found`,
            },
        });
    }
}
