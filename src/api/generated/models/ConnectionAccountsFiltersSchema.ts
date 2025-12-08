/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConnectionAccountsFiltersSchema = {
    /**
     * Provider filter
     */
    provider?: string;
    /**
     * Connection status filter
     */
    status?: ConnectionAccountsFiltersSchema.status;
    /**
     * Search keyword
     */
    search?: string;
};
export namespace ConnectionAccountsFiltersSchema {
    /**
     * Connection status filter
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        ERROR = 'error',
    }
}

