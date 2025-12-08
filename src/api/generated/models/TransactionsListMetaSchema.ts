/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SortMetaSchema } from './SortMetaSchema';
import type { TransactionsFiltersSchema } from './TransactionsFiltersSchema';
export type TransactionsListMetaSchema = {
    /**
     * Sum of all filtered transactions (before pagination)
     */
    totalAmount: number;
    /**
     * Applied filters
     */
    filters: TransactionsFiltersSchema;
    /**
     * Applied sorting options
     */
    sort: SortMetaSchema;
};

