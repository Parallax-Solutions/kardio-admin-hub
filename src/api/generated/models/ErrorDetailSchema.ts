/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErrorDetailSchema = {
    /**
     * Field name that caused the error (for validation errors)
     */
    field?: string;
    /**
     * Error issue type (e.g., required, format, minLength)
     */
    issue?: string;
    /**
     * Human-readable error description
     */
    message: string;
};

