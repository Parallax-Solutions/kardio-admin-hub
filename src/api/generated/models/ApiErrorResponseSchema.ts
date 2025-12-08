/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErrorDetailSchema } from './ErrorDetailSchema';
export type ApiErrorResponseSchema = {
    /**
     * HTTP status code
     */
    statusCode: number;
    /**
     * Error category
     */
    error: ApiErrorResponseSchema.error;
    /**
     * Stable internal application code
     */
    code: string;
    /**
     * Technical message for logs/developers
     */
    message: string;
    /**
     * User-facing message for frontend display
     */
    userMessage: string;
    /**
     * Field-level or additional error details
     */
    details: Array<ErrorDetailSchema>;
    /**
     * Whether the client should retry the request
     */
    retryable: boolean;
    /**
     * Request path
     */
    path: string;
    /**
     * ISO8601 UTC timestamp
     */
    timestamp: string;
    /**
     * Correlation ID for tracing
     */
    correlationId: string;
    /**
     * Optional extra contextual data
     */
    meta: Record<string, any>;
};
export namespace ApiErrorResponseSchema {
    /**
     * Error category
     */
    export enum error {
        VALIDATION_ERROR = 'VALIDATION_ERROR',
        AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
        AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
        NOT_FOUND = 'NOT_FOUND',
        CONFLICT = 'CONFLICT',
        INTERNAL_ERROR = 'INTERNAL_ERROR',
        DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
    }
}

