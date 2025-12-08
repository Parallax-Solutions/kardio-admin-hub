/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginationSchema } from './PaginationSchema';
export type ApiSuccessResponseSchema = {
    /**
     * HTTP status code
     */
    statusCode: number;
    /**
     * Short descriptive message
     */
    message: string;
    /**
     * Response payload - DTO, array of DTOs, or null
     */
    data: Record<string, any> | null;
    /**
     * Pagination metadata - null when not paginated
     */
    pagination: PaginationSchema | null;
    /**
     * Request path
     */
    path: string;
    /**
     * ISO8601 UTC timestamp
     */
    timestamp: string;
    /**
     * Correlation ID for request tracing
     */
    correlationId: string;
    /**
     * Optional extra metadata (filters, sort, flags, etc.)
     */
    meta: Record<string, any>;
};

