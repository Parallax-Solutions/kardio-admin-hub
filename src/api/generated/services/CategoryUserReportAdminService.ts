/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApproveChangeRequestDto } from '../models/ApproveChangeRequestDto';
import type { RejectChangeRequestDto } from '../models/RejectChangeRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryUserReportAdminService {
    /**
     * List category change reports by status
     *
     * Returns category change reports for admin review.
     *
     * **Query Parameters**:
     * - `status`: Filter by status (PENDING, APPROVED, REJECTED) - default: PENDING
     * - `limit`: Number of results (1-100) - default: 50
     * - `offset`: Pagination offset - default: 0
     *
     * @param status
     * @param limit
     * @param offset
     * @returns any List of reports with total count
     * @throws ApiError
     */
    public static categoryUserReportsAdminControllerList(
        status?: 'PENDING' | 'APPROVED' | 'REJECTED',
        limit?: number,
        offset?: number,
    ): CancelablePromise<{
        reports?: Array<{
            id?: string;
            userId?: string;
            transactionId?: string;
            merchantId?: string;
            merchantNameSnapshot?: string;
            currentCategoryIdSnapshot?: string | null;
            requestedCategoryId?: string;
            userNote?: string | null;
            status?: 'PENDING' | 'APPROVED' | 'REJECTED';
            resolvedByAdminUserId?: string | null;
            resolvedAt?: string | null;
            resolutionNote?: string | null;
            createdAt?: string;
            updatedAt?: string;
        }>;
        total?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/category-user-reports',
            query: {
                'status': status,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Approve a category change report
     *
     * Approves a category change report and applies the change globally.
     *
     * **What happens on approval**:
     * 1. Updates the global MerchantCategoryRule with the new category
     * 2. Deletes the user-specific rule (no longer needed)
     * 3. Updates ALL transactions for this merchant (all users)
     * 4. Marks the report as APPROVED
     *
     * **This affects all users' transactions for this merchant.**
     *
     * @param id
     * @param requestBody
     * @returns any Report approved and category applied globally
     * @throws ApiError
     */
    public static categoryUserReportsAdminControllerApprove(
        id: string,
        requestBody: ApproveChangeRequestDto,
    ): CancelablePromise<{
        report?: {
            id?: string;
            userId?: string;
            transactionId?: string;
            merchantId?: string;
            merchantNameSnapshot?: string;
            currentCategoryIdSnapshot?: string | null;
            requestedCategoryId?: string;
            userNote?: string | null;
            status?: 'PENDING' | 'APPROVED' | 'REJECTED';
            resolvedByAdminUserId?: string | null;
            resolvedAt?: string | null;
            resolutionNote?: string | null;
            createdAt?: string;
            updatedAt?: string;
        };
        /**
         * Whether an existing global rule was updated
         */
        globalRuleUpdated?: boolean;
        /**
         * Whether the user-specific rule was deleted
         */
        userRuleDeleted?: boolean;
        /**
         * Number of transactions updated globally
         */
        transactionsUpdated?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/category-user-reports/{id}/approve',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Report already resolved`,
                404: `Report not found`,
            },
        });
    }
    /**
     * Reject a category change report
     *
     * Rejects a category change report without applying the change globally.
     *
     * **What happens on rejection**:
     * 1. Marks the report as REJECTED with the provided note
     * 2. The user's personal category change remains active (user-specific rule stays)
     * 3. Other users are not affected
     *
     * **A resolution note is required when rejecting.**
     *
     * @param id
     * @param requestBody
     * @returns any Report rejected
     * @throws ApiError
     */
    public static categoryUserReportsAdminControllerReject(
        id: string,
        requestBody: RejectChangeRequestDto,
    ): CancelablePromise<{
        id?: string;
        userId?: string;
        transactionId?: string;
        merchantId?: string;
        merchantNameSnapshot?: string;
        currentCategoryIdSnapshot?: string | null;
        requestedCategoryId?: string;
        userNote?: string | null;
        status?: 'PENDING' | 'APPROVED' | 'REJECTED';
        resolvedByAdminUserId?: string | null;
        resolvedAt?: string | null;
        resolutionNote?: string | null;
        createdAt?: string;
        updatedAt?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/category-user-reports/{id}/reject',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid rejection`,
                404: `Report not found`,
            },
        });
    }
}
