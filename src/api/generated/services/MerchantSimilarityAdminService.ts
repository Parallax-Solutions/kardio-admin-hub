/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MergeMerchantsDto } from '../models/MergeMerchantsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MerchantSimilarityAdminService {
    /**
     * Get merchant similarity suggestions
     *
     * Returns similarity suggestions for admin review.
     *
     * **Query Parameters**:
     * - `status`: Filter by status (PENDING, ACCEPTED, REJECTED) - default: PENDING
     * - `limit`: Number of results (1-100) - default: 20
     * - `offset`: Pagination offset - default: 0
     *
     * **Response**: For PENDING status, includes full merchant details with transaction/rule counts.
     *
     * @param status Filter by suggestion status
     * @param limit Number of results to return (1-100)
     * @param offset Pagination offset
     * @returns any List of similarity suggestions
     * @throws ApiError
     */
    public static merchantSimilarityControllerGetSuggestions(
        status?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
        limit: number = 20,
        offset?: number,
    ): CancelablePromise<Array<{
        id?: string;
        similarityScore?: number;
        status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
        canonicalNameSnapshot?: string;
        candidateNameSnapshot?: string;
        resolvedByUserId?: string | null;
        resolvedAt?: string | null;
        createdAt?: string;
        updatedAt?: string;
        canonicalMerchant?: {
            id?: string;
            originalName?: string;
            normalizedName?: string;
            transactionCount?: number;
            ruleCount?: number;
        };
        candidateMerchant?: {
            id?: string;
            originalName?: string;
            normalizedName?: string;
            transactionCount?: number;
            ruleCount?: number;
        };
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/merchant-similarity/suggestions',
            query: {
                'status': status,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get count of pending suggestions
     * Returns the number of pending similarity suggestions awaiting review.
     * @returns any Pending count
     * @throws ApiError
     */
    public static merchantSimilarityControllerGetPendingCount(): CancelablePromise<{
        count?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/merchant-similarity/suggestions/count',
        });
    }
    /**
     * Accept a suggestion (merge merchants)
     *
     * Accepts a similarity suggestion and merges the candidate merchant into the canonical merchant.
     *
     * **What happens on merge**:
     * 1. All transactions from candidate are moved to canonical
     * 2. Category rules are migrated (duplicates are removed)
     * 3. Related suggestions are marked as resolved
     * 4. Candidate merchant is deleted
     *
     * **This action cannot be undone.**
     *
     * @param id Suggestion ID
     * @returns any Suggestion accepted and merchants merged
     * @throws ApiError
     */
    public static merchantSimilarityControllerAcceptSuggestion(
        id: string,
    ): CancelablePromise<{
        suggestion?: {
            id?: string;
            similarityScore?: number;
            status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
            canonicalNameSnapshot?: string;
            candidateNameSnapshot?: string;
            resolvedByUserId?: string | null;
            resolvedAt?: string | null;
            createdAt?: string;
            updatedAt?: string;
        };
        mergeResult?: {
            canonicalMerchantId?: string;
            deletedMerchantId?: string;
            transactionsUpdated?: number;
            rulesUpdated?: number;
            rulesDeduplicated?: number;
            suggestionsResolved?: number;
        } | null;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/merchant-similarity/suggestions/{id}/accept',
            path: {
                'id': id,
            },
            errors: {
                400: `Suggestion already resolved`,
                404: `Suggestion not found`,
            },
        });
    }
    /**
     * Reject a suggestion
     *
     * Rejects a similarity suggestion without merging.
     *
     * The suggestion will be marked as REJECTED and won't appear in the pending list.
     * The similarity job won't recreate this suggestion.
     *
     * @param id Suggestion ID
     * @returns any Suggestion rejected
     * @throws ApiError
     */
    public static merchantSimilarityControllerRejectSuggestion(
        id: string,
    ): CancelablePromise<{
        suggestion?: {
            id?: string;
            similarityScore?: number;
            status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
            canonicalNameSnapshot?: string;
            candidateNameSnapshot?: string;
            resolvedByUserId?: string | null;
            resolvedAt?: string | null;
            createdAt?: string;
            updatedAt?: string;
        };
        mergeResult?: {
            canonicalMerchantId?: string;
            deletedMerchantId?: string;
            transactionsUpdated?: number;
            rulesUpdated?: number;
            rulesDeduplicated?: number;
            suggestionsResolved?: number;
        } | null;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/merchant-similarity/suggestions/{id}/reject',
            path: {
                'id': id,
            },
            errors: {
                404: `Suggestion not found`,
            },
        });
    }
    /**
     * Manually merge two merchants
     *
     * Manually merges two merchants without a pre-existing suggestion.
     *
     * Use this when you want to merge merchants that weren't detected by the similarity algorithm.
     *
     * **Request body**:
     * - `canonicalMerchantId`: The merchant to keep
     * - `candidateMerchantId`: The merchant to merge and delete
     *
     * @param requestBody
     * @returns any Merchants merged successfully
     * @throws ApiError
     */
    public static merchantSimilarityControllerMergeMerchants(
        requestBody: MergeMerchantsDto,
    ): CancelablePromise<{
        canonicalMerchantId?: string;
        deletedMerchantId?: string;
        transactionsUpdated?: number;
        rulesUpdated?: number;
        rulesDeduplicated?: number;
        suggestionsResolved?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/merchant-similarity/merge',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid merge request`,
                404: `Merchant not found`,
            },
        });
    }
    /**
     * Run the similarity analysis job manually
     *
     * Triggers the merchant similarity analysis job manually.
     *
     * The job:
     * 1. Reads the last processed timestamp from the database
     * 2. Analyzes merchants created after that timestamp
     * 3. Creates suggestions for similar merchant pairs (similarity >= threshold)
     * 4. Updates the job state with the new timestamp
     *
     * **Configuration** (via environment variables):
     * - `MERCHANT_SIMILARITY_THRESHOLD`: Minimum similarity score (default: 0.75)
     * - `MERCHANT_SIMILARITY_MAX_CANDIDATES`: Max candidates per merchant (default: 10)
     * - `MERCHANT_SIMILARITY_BATCH_SIZE`: Batch size (default: 100)
     *
     * **Note**: The job also runs automatically daily at 3am.
     *
     * @returns any Job completed
     * @throws ApiError
     */
    public static merchantSimilarityControllerRunSimilarityJob(): CancelablePromise<{
        merchantsAnalyzed?: number;
        suggestionsCreated?: number;
        suggestionsSkipped?: number;
        lastProcessedAt?: string | null;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/merchant-similarity/job/run',
        });
    }
}
