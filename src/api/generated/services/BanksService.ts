/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBankDto } from '../models/CreateBankDto';
import type { UpdateBankDto } from '../models/UpdateBankDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BanksService {
    /**
     * Get all banks
     *
     * Returns all banks in the system with filtering and sorting support.
     *
     * **Sorting**:
     * - `sortBy`: Field to sort by (name, country, createdAt) - default: name
     * - `sortOrder`: Sort order (asc, desc) - default: asc
     *
     * **Filters**:
     * - `active`: Filter by active status (true/false)
     * - `country`: Filter by country code (e.g., CR, US)
     * - `search`: Search by bank name (partial match)
     *
     * **Response**: Wrapped in `ApiSuccessResponse` envelope with:
     * - `data`: Array of banks
     * - `pagination`: null (banks is a small list for dropdowns)
     * - `meta`: Applied filters and sort options
     *
     * @param sortBy Field to sort by
     * @param sortOrder Sort order
     * @param active Filter by active status
     * @param country Filter by country code (ISO 3166-1 alpha-2)
     * @param search Search by bank name (partial match)
     * @returns any List of banks
     * @throws ApiError
     */
    public static banksControllerFindAll(
        sortBy?: 'name' | 'country' | 'createdAt',
        sortOrder: 'asc' | 'desc' = 'asc',
        active?: boolean,
        country?: string,
        search?: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            name?: string;
            slug?: string;
            country?: string;
            emailDomains?: Array<string>;
            isActive?: boolean;
        }>;
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: {
            filters?: {
                active?: boolean | null;
                country?: string | null;
                search?: string | null;
            };
            sort?: {
                sortBy?: string;
                sortOrder?: 'asc' | 'desc';
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banks',
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'active': active,
                'country': country,
                'search': search,
            },
        });
    }
    /**
     * Create new bank
     * Creates a new bank in the system. Requires admin privileges. Response wrapped in `ApiSuccessResponse` envelope.
     * @param requestBody
     * @returns any Bank created successfully
     * @throws ApiError
     */
    public static banksControllerCreate(
        requestBody: CreateBankDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            name?: string;
            slug?: string;
            country?: string;
            emailDomains?: Array<string>;
            isActive?: boolean;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/banks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
            },
        });
    }
    /**
     * Get banks by country
     * Returns all banks for a specific country. Response wrapped in `ApiSuccessResponse` envelope.
     * @param country
     * @returns any List of banks for the country
     * @throws ApiError
     */
    public static banksControllerFindByCountry(
        country: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            name?: string;
            slug?: string;
            country?: string;
            emailDomains?: Array<string>;
            isActive?: boolean;
        }>;
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banks/country/{country}',
            path: {
                'country': country,
            },
        });
    }
    /**
     * Get bank by ID
     * Returns a single bank by its ID. Response wrapped in `ApiSuccessResponse` envelope.
     * @param id
     * @returns any Bank details
     * @throws ApiError
     */
    public static banksControllerFindOne(
        id: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            name?: string;
            slug?: string;
            country?: string;
            emailDomains?: Array<string>;
            isActive?: boolean;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banks/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Bank not found`,
            },
        });
    }
    /**
     * Update bank
     * Updates an existing bank. Response wrapped in `ApiSuccessResponse` envelope.
     * @param id
     * @param requestBody
     * @returns any Bank updated successfully
     * @throws ApiError
     */
    public static banksControllerUpdate(
        id: string,
        requestBody: UpdateBankDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            name?: string;
            slug?: string;
            country?: string;
            emailDomains?: Array<string>;
            isActive?: boolean;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/banks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Bank not found`,
            },
        });
    }
    /**
     * Delete bank
     * Permanently deletes a bank. This will also remove associated parser configs. Response wrapped in `ApiSuccessResponse` envelope with `data: null`.
     * @param id
     * @returns any Bank deleted successfully
     * @throws ApiError
     */
    public static banksControllerRemove(
        id: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: null | null;
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/banks/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Bank not found`,
            },
        });
    }
    /**
     * Toggle bank active status
     * Toggles the active status of a bank. Inactive banks are not used for email parsing. Response wrapped in `ApiSuccessResponse` envelope.
     * @param id
     * @returns any Bank status toggled
     * @throws ApiError
     */
    public static banksControllerToggleActive(
        id: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            name?: string;
            slug?: string;
            country?: string;
            emailDomains?: Array<string>;
            isActive?: boolean;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/banks/{id}/toggle',
            path: {
                'id': id,
            },
            errors: {
                404: `Bank not found`,
            },
        });
    }
}
