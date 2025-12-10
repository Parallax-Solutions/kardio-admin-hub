/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkMapSynonymsDto } from '../models/BulkMapSynonymsDto';
import type { MapSynonymDto } from '../models/MapSynonymDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CurrencySynonymsService {
    /**
     * Get all currency synonyms (paginated)
     *
     * Returns paginated currency synonyms with search and filter support.
     *
     * **Pagination**:
     * - `page`: Page number (default: 1)
     * - `limit`: Items per page (default: 20, max: 100)
     *
     * **Filters**:
     * - `search`: Search by raw label or normalized label (partial match)
     * - `status`: Filter by status (UNMAPPED, MAPPED)
     *
     * @param page Page number (1-indexed)
     * @param limit Number of items per page
     * @param search Search by raw label or normalized label (partial match, case-insensitive)
     * @param status Filter by status
     * @returns any Paginated list of synonyms
     * @throws ApiError
     */
    public static currencySynonymsControllerFindAll(
        page: number = 1,
        limit: number = 20,
        search?: string,
        status?: 'UNMAPPED' | 'MAPPED',
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            rawLabel?: string;
            normalizedLabel?: string;
            status?: 'UNMAPPED' | 'MAPPED';
            currencyCode?: string | null;
            occurrences?: number;
            firstSeenAt?: string;
            lastSeenAt?: string;
            createdBy?: 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';
            currency?: {
                code?: string;
                name?: string;
            } | null;
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
            url: '/api/currency-synonyms',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'status': status,
            },
        });
    }
    /**
     * Get unmapped currency synonyms (paginated)
     *
     * Returns paginated unmapped currency synonyms ordered by occurrences (most frequent first).
     *
     * **Pagination**:
     * - `page`: Page number (default: 1)
     * - `limit`: Items per page (default: 20, max: 100)
     *
     * **Filters**:
     * - `search`: Search by raw label or normalized label (partial match)
     *
     * Use this to identify currency labels that need to be mapped to actual currencies.
     *
     * @param page Page number (1-indexed)
     * @param limit Number of items per page
     * @param search Search by raw label or normalized label (partial match, case-insensitive)
     * @param status Filter by status
     * @returns any Paginated list of unmapped synonyms
     * @throws ApiError
     */
    public static currencySynonymsControllerFindUnmapped(
        page: number = 1,
        limit: number = 20,
        search?: string,
        status?: 'UNMAPPED' | 'MAPPED',
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            rawLabel?: string;
            normalizedLabel?: string;
            status?: 'UNMAPPED' | 'MAPPED';
            currencyCode?: string | null;
            occurrences?: number;
            firstSeenAt?: string;
            lastSeenAt?: string;
            createdBy?: 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';
            currency?: {
                code?: string;
                name?: string;
            } | null;
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
            url: '/api/currency-synonyms/unmapped',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'status': status,
            },
        });
    }
    /**
     * Get currency synonym statistics
     *
     * Returns aggregated statistics about currency synonyms.
     *
     * **Response includes**:
     * - `total`: Total number of synonyms
     * - `byStatus`: Count of synonyms by status (UNMAPPED, MAPPED)
     * - `totalUnmappedOccurrences`: Sum of occurrences for all unmapped synonyms
     *
     * @returns any Synonym statistics
     * @throws ApiError
     */
    public static currencySynonymsControllerGetStats(): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            total?: number;
            byStatus?: {
                UNMAPPED?: number;
                MAPPED?: number;
            };
            totalUnmappedOccurrences?: number;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/currency-synonyms/stats',
        });
    }
    /**
     * Get synonyms for a currency
     * Returns all mapped synonyms for a specific currency code.
     * @param currencyCode
     * @returns any List of synonyms for the currency
     * @throws ApiError
     */
    public static currencySynonymsControllerFindByCurrency(
        currencyCode: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            rawLabel?: string;
            normalizedLabel?: string;
            status?: 'UNMAPPED' | 'MAPPED';
            currencyCode?: string | null;
            occurrences?: number;
            firstSeenAt?: string;
            lastSeenAt?: string;
            createdBy?: 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';
            currency?: {
                code?: string;
                name?: string;
            } | null;
        }>;
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/currency-synonyms/currency/{currencyCode}',
            path: {
                'currencyCode': currencyCode,
            },
        });
    }
    /**
     * Get synonym by ID
     * Returns a single currency synonym by its ID.
     * @param id
     * @returns any Synonym details
     * @throws ApiError
     */
    public static currencySynonymsControllerFindOne(
        id: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            rawLabel?: string;
            normalizedLabel?: string;
            status?: 'UNMAPPED' | 'MAPPED';
            currencyCode?: string | null;
            occurrences?: number;
            firstSeenAt?: string;
            lastSeenAt?: string;
            createdBy?: 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';
            currency?: {
                code?: string;
                name?: string;
            } | null;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/currency-synonyms/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Synonym not found`,
            },
        });
    }
    /**
     * Map synonym to currency
     *
     * Maps a currency synonym to an actual currency.
     *
     * **Side effects**:
     * - Updates synonym status to MAPPED
     * - Updates all transactions with this synonym to use the mapped currency
     * - Clears currencySynonymId from updated transactions
     *
     * **Returns**: The updated synonym and count of transactions updated.
     *
     * @param id
     * @param requestBody
     * @returns any Synonym mapped successfully
     * @throws ApiError
     */
    public static currencySynonymsControllerMapToCurrency(
        id: string,
        requestBody: MapSynonymDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            synonym?: {
                id?: string;
                rawLabel?: string;
                normalizedLabel?: string;
                status?: 'UNMAPPED' | 'MAPPED';
                currencyCode?: string | null;
                occurrences?: number;
                firstSeenAt?: string;
                lastSeenAt?: string;
                createdBy?: 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';
                currency?: {
                    code?: string;
                    name?: string;
                } | null;
            };
            transactionsUpdated?: number;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/currency-synonyms/{id}/map',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid currency code`,
                404: `Synonym or currency not found`,
            },
        });
    }
    /**
     * Bulk map multiple synonyms to currencies
     *
     * Maps multiple currency synonyms to their respective currencies in a single request.
     *
     * **Request body**:
     * - `mappings`: Array of { synonymId, currencyCode } pairs
     *
     * **Side effects** (per mapping):
     * - Updates synonym status to MAPPED
     * - Updates all transactions with this synonym to use the mapped currency
     * - Resets synonym occurrences to 0
     *
     * **Returns**: Summary of successful and failed mappings with details.
     *
     * @param requestBody
     * @returns any Bulk mapping results
     * @throws ApiError
     */
    public static currencySynonymsControllerBulkMap(
        requestBody: BulkMapSynonymsDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            successful?: number;
            failed?: number;
            results?: Array<{
                synonymId?: string;
                success?: boolean;
                transactionsUpdated?: number;
                error?: string | null;
            }>;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/currency-synonyms/bulk-map',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
