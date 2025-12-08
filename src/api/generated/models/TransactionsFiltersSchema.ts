/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TransactionsFiltersSchema = {
    /**
     * Start date filter
     */
    startDate?: string;
    /**
     * End date filter
     */
    endDate?: string;
    /**
     * Category ID filter
     */
    categoryId?: string;
    /**
     * Bank ID filter
     */
    bankId?: string;
    /**
     * Merchant name filter
     */
    merchant?: string;
    /**
     * Search keyword
     */
    search?: string;
    /**
     * Transaction type filter
     */
    transactionType?: Array<string>;
    /**
     * Reconciliation status filter
     */
    reconciliationStatus?: Array<string>;
    /**
     * Minimum amount filter
     */
    minAmount?: number;
    /**
     * Maximum amount filter
     */
    maxAmount?: number;
};

