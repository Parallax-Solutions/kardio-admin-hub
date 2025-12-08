/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateParserConfigDto } from '../models/CreateParserConfigDto';
import type { TestParserConfigDto } from '../models/TestParserConfigDto';
import type { UpdateParserConfigDto } from '../models/UpdateParserConfigDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ParserConfigsService {
    /**
     * Get all parser configs
     * @param sortBy Field to sort by
     * @param sortOrder Sort order
     * @param bankId Filter by bank ID
     * @param active Filter by active status
     * @param search Search by config name (partial match)
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerFindAll(
        sortBy?: 'name' | 'bankId' | 'createdAt',
        sortOrder: 'asc' | 'desc' = 'asc',
        bankId?: string,
        active?: boolean,
        search?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parser-configs',
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'bankId': bankId,
                'active': active,
                'search': search,
            },
        });
    }
    /**
     * Create new parser config
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerCreate(
        requestBody: CreateParserConfigDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/parser-configs',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get active parser config for a bank
     * @param bankId Bank ID
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerFindActiveByBank(
        bankId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parser-configs/bank/{bankId}/active',
            path: {
                'bankId': bankId,
            },
        });
    }
    /**
     * Get parser config by ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parser-configs/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update parser config
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerUpdate(
        id: string,
        requestBody: UpdateParserConfigDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/parser-configs/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete parser config
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/parser-configs/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Activate parser config (deactivates others for same bank)
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerActivate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/parser-configs/{id}/activate',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Deactivate parser config
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerDeactivate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/parser-configs/{id}/deactivate',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Test parser rules against sample email
     *
     * Test parser rules against a sample email HTML without saving the configuration.
     *
     * This endpoint allows you to:
     * - Validate that your regex patterns extract the expected data
     * - Test email sender and subject pattern matching
     * - Preview the extracted transaction data
     *
     * **Note**: This only tests RULE_BASED parsing. AI parsing is not supported in test mode.
     *
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static parserConfigsControllerTestParser(
        requestBody: TestParserConfigDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/parser-configs/test',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
