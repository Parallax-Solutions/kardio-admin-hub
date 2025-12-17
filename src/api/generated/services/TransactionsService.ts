/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTransactionDto } from '../models/CreateTransactionDto';
import type { UpdateTransactionCategoryDto } from '../models/UpdateTransactionCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionsService {
    /**
     * Get all transactions for current user (paginated)
     *
     * Returns paginated transactions for the authenticated user with filtering and sorting support.
     *
     * **Pagination**:
     * - `page`: Page number (default: 1, min: 1)
     * - `limit`: Items per page (default: 20, min: 1, max: 100)
     *
     * **Sorting**:
     * - `sortBy`: Field to sort by (date, amount, merchant, createdAt)
     * - `sortOrder`: Sort order (asc, desc - default: desc)
     *
     * **Filters**:
     * - `startDate`: Filter transactions after this date (ISO-8601)
     * - `endDate`: Filter transactions before this date (ISO-8601)
     * - `categoryId`: Filter by category ID
     * - `bankId`: Filter by bank ID
     * - `currency`: Filter by currency code (e.g., USD, CRC)
     * - `connectionAccountId`: Filter by connection account ID
     * - `merchant`: Search in merchant name (partial match)
     * - `search`: Full-text search (merchant, client name)
     * - `minAmount`: Minimum amount filter (in minor units)
     * - `maxAmount`: Maximum amount filter (in minor units)
     *
     * **Response**: Wrapped in `ApiSuccessResponse` envelope with:
     * - `data`: Array of transactions
     * - `pagination`: Page info (page, limit, totalItems, totalPages, hasNext, hasPrev)
     * - `meta`: Applied filters, sort options, and **totalAmount** (sum of all filtered transactions before pagination)
     *
     * @param page Page number (1-indexed)
     * @param limit Number of items per page
     * @param sortBy Field to sort by
     * @param sortOrder Sort order
     * @param startDate Filter transactions after this date (inclusive)
     * @param endDate Filter transactions before this date (inclusive)
     * @param categoryId Filter by category ID
     * @param bankId Filter by bank ID
     * @param currency Filter by currency code
     * @param connectionAccountId Filter by connection account ID
     * @param merchant Search by merchant name (partial match)
     * @param search Search keyword (searches merchant, client name)
     * @param minAmount Minimum amount filter (in minor units)
     * @param maxAmount Maximum amount filter (in minor units)
     * @returns any Paginated list of transactions
     * @throws ApiError
     */
    public static transactionsControllerFindAll(
        page: number = 1,
        limit: number = 20,
        sortBy?: 'date' | 'amount' | 'merchant' | 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc',
        startDate?: string,
        endDate?: string,
        categoryId?: string,
        bankId?: string,
        currency?: string,
        connectionAccountId?: string,
        merchant?: string,
        search?: string,
        minAmount?: number,
        maxAmount?: number,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            userId?: string;
            connectionAccountId?: string | null;
            bankId?: string | null;
            parserConfigId?: string | null;
            date?: string;
            merchantSnapshotName?: string;
            amount?: number;
            currency?: string;
            clientId?: string | null;
            categoryId?: string | null;
            categoryAssignmentSource?: 'NONE' | 'MERCHANT_GLOBAL_AI' | 'MERCHANT_GLOBAL_USER' | 'MERCHANT_USER_MANUAL' | 'TRANSACTION_USER_MANUAL' | null;
            categoryStatus?: 'NEEDED' | 'PENDING' | 'COMPLETED' | 'FAILED' | null;
            sourceType?: string;
            sourceId?: string | null;
            reconciliationStatus?: string;
            reconciliationSource?: string | null;
            reconciledAt?: string | null;
            authCode?: string | null;
            reference?: string | null;
            transactionType?: string | null;
            cardLast4?: string | null;
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
        meta?: {
            /**
             * Sum of all filtered transactions (before pagination)
             */
            totalAmount?: number;
            filters?: {
                startDate?: string | null;
                endDate?: string | null;
                categoryId?: string | null;
                bankId?: string | null;
                currency?: string | null;
                connectionAccountId?: string | null;
                merchant?: string | null;
                search?: string | null;
                minAmount?: number | null;
                maxAmount?: number | null;
            };
            sort?: {
                sortBy?: string;
                sortOrder?: 'asc' | 'desc';
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions',
            query: {
                'page': page,
                'limit': limit,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'startDate': startDate,
                'endDate': endDate,
                'categoryId': categoryId,
                'bankId': bankId,
                'currency': currency,
                'connectionAccountId': connectionAccountId,
                'merchant': merchant,
                'search': search,
                'minAmount': minAmount,
                'maxAmount': maxAmount,
            },
        });
    }
    /**
     * Create new transaction (manual)
     * Manually creates a transaction. For automatic transaction creation from emails, use the sync endpoint. Response wrapped in `ApiSuccessResponse` envelope.
     * @param requestBody
     * @returns any Transaction created successfully
     * @throws ApiError
     */
    public static transactionsControllerCreate(
        requestBody: CreateTransactionDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            userId?: string;
            connectionAccountId?: string | null;
            bankId?: string | null;
            parserConfigId?: string | null;
            date?: string;
            merchantSnapshotName?: string;
            amount?: number;
            currency?: string;
            clientId?: string | null;
            categoryId?: string | null;
            categoryAssignmentSource?: 'NONE' | 'MERCHANT_GLOBAL_AI' | 'MERCHANT_GLOBAL_USER' | 'MERCHANT_USER_MANUAL' | 'TRANSACTION_USER_MANUAL' | null;
            categoryStatus?: 'NEEDED' | 'PENDING' | 'COMPLETED' | 'FAILED' | null;
            sourceType?: string;
            sourceId?: string | null;
            reconciliationStatus?: string;
            reconciliationSource?: string | null;
            reconciledAt?: string | null;
            authCode?: string | null;
            reference?: string | null;
            transactionType?: string | null;
            cardLast4?: string | null;
            createdAt?: string;
            updatedAt?: string;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/transactions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
            },
        });
    }
    /**
     * Get transaction summary (count and total amount)
     *
     * Returns aggregated summary of transactions matching the filters.
     * This is an optimized endpoint that only returns count and total amount without fetching individual transactions.
     *
     * **Filters** (same as list endpoint):
     * - `startDate`: Filter transactions after this date (ISO-8601)
     * - `endDate`: Filter transactions before this date (ISO-8601)
     * - `categoryId`: Filter by category ID
     * - `bankId`: Filter by bank ID
     * - `merchant`: Search in merchant name (partial match)
     * - `search`: Full-text search (merchant, client name)
     * - `transactionType`: Filter by type (comma-separated: PURCHASE,WITHDRAWAL)
     * - `reconciliationStatus`: Filter by status (comma-separated: RECONCILED,PENDING)
     * - `minAmount`: Minimum amount filter (in minor units)
     * - `maxAmount`: Maximum amount filter (in minor units)
     *
     * **Response**: Wrapped in `ApiSuccessResponse` envelope with:
     * - `data.totalCount`: Number of matching transactions
     * - `data.totalAmount`: Sum of all matching transaction amounts
     * - `meta.filters`: Applied filters
     *
     * @param startDate Filter transactions after this date (inclusive)
     * @param endDate Filter transactions before this date (inclusive)
     * @param categoryId Filter by category ID
     * @param bankId Filter by bank ID
     * @param merchant Search by merchant name (partial match)
     * @param search Search keyword (searches merchant, client name)
     * @param transactionType Filter by transaction type (comma-separated for multiple)
     * @param reconciliationStatus Filter by reconciliation status (comma-separated for multiple)
     * @param minAmount Minimum amount filter (in minor units)
     * @param maxAmount Maximum amount filter (in minor units)
     * @returns any Transaction summary
     * @throws ApiError
     */
    public static transactionsControllerGetSummary(
        startDate?: string,
        endDate?: string,
        categoryId?: string,
        bankId?: string,
        merchant?: string,
        search?: string,
        transactionType?: Array<string>,
        reconciliationStatus?: Array<string>,
        minAmount?: number,
        maxAmount?: number,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            /**
             * Total number of filtered transactions
             */
            totalCount?: number;
            /**
             * Sum of all filtered transactions
             */
            totalAmount?: number;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: {
            filters?: {
                startDate?: string | null;
                endDate?: string | null;
                categoryId?: string | null;
                bankId?: string | null;
                merchant?: string | null;
                search?: string | null;
                transactionType?: Array<string> | null;
                reconciliationStatus?: Array<string> | null;
                minAmount?: number | null;
                maxAmount?: number | null;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/summary',
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'categoryId': categoryId,
                'bankId': bankId,
                'merchant': merchant,
                'search': search,
                'transactionType': transactionType,
                'reconciliationStatus': reconciliationStatus,
                'minAmount': minAmount,
                'maxAmount': maxAmount,
            },
        });
    }
    /**
     * Get transaction by ID
     * Returns a single transaction by its ID. Response wrapped in `ApiSuccessResponse` envelope.
     * @param id
     * @returns any Transaction details
     * @throws ApiError
     */
    public static transactionsControllerFindOne(
        id: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            id?: string;
            userId?: string;
            connectionAccountId?: string | null;
            bankId?: string | null;
            parserConfigId?: string | null;
            date?: string;
            merchantSnapshotName?: string;
            amount?: number;
            currency?: string;
            clientId?: string | null;
            categoryId?: string | null;
            categoryAssignmentSource?: 'NONE' | 'MERCHANT_GLOBAL_AI' | 'MERCHANT_GLOBAL_USER' | 'MERCHANT_USER_MANUAL' | 'TRANSACTION_USER_MANUAL' | null;
            categoryStatus?: 'NEEDED' | 'PENDING' | 'COMPLETED' | 'FAILED' | null;
            sourceType?: string;
            sourceId?: string | null;
            reconciliationStatus?: string;
            reconciliationSource?: string | null;
            reconciledAt?: string | null;
            authCode?: string | null;
            reference?: string | null;
            transactionType?: string | null;
            cardLast4?: string | null;
            createdAt?: string;
            updatedAt?: string;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Transaction not found`,
            },
        });
    }
    /**
     * Delete transaction
     * Permanently deletes a transaction. This action cannot be undone. Response wrapped in `ApiSuccessResponse` envelope with `data: null`.
     * @param id
     * @returns any Transaction deleted successfully
     * @throws ApiError
     */
    public static transactionsControllerRemove(
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
            url: '/api/transactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Transaction not found`,
            },
        });
    }
    /**
     * Update transaction category (ADR-0014)
     *
     * Updates the category of a transaction with support for merchant-wide rules.
     *
     * **Request Body**:
     * - `categoryId` (required): The category ID to assign
     * - `applyToAllMerchantTransactions` (optional, default: false): If true, applies the category to all transactions from the same merchant for this user
     *
     * **Behavior**:
     * 1. **Single transaction** (`applyToAllMerchantTransactions: false`):
     * - Updates only this transaction
     * - Sets `categoryAssignmentSource` to `TRANSACTION_USER_MANUAL`
     * - No merchant rule is created
     *
     * 2. **All merchant transactions** (`applyToAllMerchantTransactions: true`):
     * - Creates or updates a user-specific merchant category rule
     * - Updates all transactions from this merchant for the user
     * - Sets `categoryAssignmentSource` to `MERCHANT_USER_MANUAL`
     * - If the selected category matches the global rule, no user rule is created (uses global)
     *
     * **Response**:
     * - `transactionId`: The transaction ID
     * - `categoryId`: The assigned category ID
     * - `source`: How the category was assigned (TRANSACTION_USER_MANUAL, MERCHANT_USER_MANUAL, etc.)
     * - `appliedToMerchant`: Whether the change was applied to all merchant transactions
     * - `transactionsUpdated`: Number of transactions updated
     * - `ruleCreated`: Whether a new merchant rule was created
     *
     * @param id
     * @param requestBody
     * @returns any Category updated successfully
     * @throws ApiError
     */
    public static transactionsControllerUpdateCategory(
        id: string,
        requestBody: UpdateTransactionCategoryDto,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: {
            transactionId?: string;
            categoryId?: string;
            source?: 'TRANSACTION_USER_MANUAL' | 'MERCHANT_USER_MANUAL' | 'MERCHANT_GLOBAL_AI' | 'MERCHANT_GLOBAL_USER';
            appliedToMerchant?: boolean;
            transactionsUpdated?: number;
            ruleCreated?: boolean;
        };
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/transactions/{id}/category',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Category ID is required`,
                404: `Transaction not found`,
            },
        });
    }
}
