/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SyncOptionsDto = {
    /**
     * Start date for sync (inclusive). Only sync emails after this date.
     */
    afterDate?: string;
    /**
     * End date for sync (inclusive). Maximum 90 days from start date.
     */
    beforeDate?: string;
};

