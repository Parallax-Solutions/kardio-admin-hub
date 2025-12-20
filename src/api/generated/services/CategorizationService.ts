/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategorizationService {
    /**
     * Manually run categorization batch job (Admin only)
     * @returns any Job executed successfully
     * @throws ApiError
     */
    public static categorizationControllerRunManually(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/categorization/run',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - Admin only`,
            },
        });
    }
}
