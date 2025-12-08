/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SortMetaSchema } from './SortMetaSchema';
export type ListMetaSchema = {
    /**
     * Applied filters (varies by endpoint)
     */
    filters: Record<string, any>;
    /**
     * Applied sorting options
     */
    sort: SortMetaSchema;
};

