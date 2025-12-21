/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateChangeRequestDto } from '../models/CreateChangeRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryUserReportsService {
    /**
     * Submit a category change report
     *
     * Submits a report when a user believes a transaction's category is incorrect.
     *
     * **What happens**:
     * 1. Creates a pending report for admin review
     * 2. Immediately applies the category change for the user's transactions
     * 3. Creates a user-specific category rule
     *
     * The user sees their transactions corrected immediately, while the admin decides whether to apply globally.
     *
     * @param requestBody
     * @returns any Report created and category applied for user
     * @throws ApiError
     */
    public static categoryUserReportsControllerCreate(
        requestBody: CreateChangeRequestDto,
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
            url: '/api/me/category-user-reports',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
            },
        });
    }
    /**
     * List my category change reports
     * Returns all category change reports submitted by the current user.
     * @returns any List of user reports
     * @throws ApiError
     */
    public static categoryUserReportsControllerListMine(): CancelablePromise<Array<{
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
    }>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/me/category-user-reports',
        });
    }
}
