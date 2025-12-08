/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCategoryDto } from '../models/CreateCategoryDto';
import type { UpdateCategoryDto } from '../models/UpdateCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * Get all categories for current user
     *
     * Returns all expense categories for the authenticated user. Includes both system default and user-created categories.
     *
     * **Sorting**:
     * - `sortBy`: Field to sort by (name, createdAt) - default: name
     * - `sortOrder`: Sort order (asc, desc) - default: asc
     *
     * **Filters**:
     * - `type`: Filter by category type (income, expense)
     * - `search`: Search by category name (partial match)
     *
     * **Response**: Wrapped in `ApiSuccessResponse` envelope with:
     * - `data`: Array of categories
     * - `pagination`: null (categories is a small list)
     * - `meta`: Applied filters and sort options
     *
     * @param sortBy Field to sort by
     * @param sortOrder Sort order
     * @param type Filter by category type
     * @param search Search by category name (partial match)
     * @returns any List of categories
     * @throws ApiError
     */
    public static categoriesControllerFindAll(
        sortBy?: 'name' | 'createdAt',
        sortOrder: 'asc' | 'desc' = 'asc',
        type?: 'income' | 'expense',
        search?: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            name?: string;
            icon?: string;
            color?: string;
            isSystem?: boolean;
        }>;
        pagination?: null | null;
        path?: string;
        timestamp?: string;
        correlationId?: string;
        meta?: {
            filters?: {
                type?: string | null;
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
            url: '/api/categories',
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'type': type,
                'search': search,
            },
        });
    }
    /**
     * Create new category
     * Creates a custom expense category for the user.
     * @param requestBody
     * @returns any Category created successfully
     * @throws ApiError
     */
    public static categoriesControllerCreate(
        requestBody: CreateCategoryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
            },
        });
    }
    /**
     * Get category by ID
     * Returns a single category by its ID.
     * @param id
     * @returns any Category details
     * @throws ApiError
     */
    public static categoriesControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Update category
     * Updates an existing category. System categories cannot be modified.
     * @param id
     * @param requestBody
     * @returns any Category updated successfully
     * @throws ApiError
     */
    public static categoriesControllerUpdate(
        id: string,
        requestBody: UpdateCategoryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/categories/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Delete category
     * Deletes a custom category. System categories cannot be deleted. Transactions using this category will have their category set to null.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static categoriesControllerRemove(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/categories/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
}
