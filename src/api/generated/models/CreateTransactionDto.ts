/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTransactionDto = {
    /**
     * Transaction date
     */
    date: string;
    /**
     * Name of the merchant
     */
    merchant: string;
    /**
     * Transaction amount in minor units (e.g., cents)
     */
    amount: number;
    /**
     * ISO 4217 currency code
     */
    currency: string;
    /**
     * ID of the category to assign
     */
    categoryId?: string;
    /**
     * City where the transaction occurred
     */
    city?: string;
    /**
     * Country where the transaction occurred
     */
    country?: string;
    /**
     * Authorization code from the bank
     */
    authCode?: string;
    /**
     * Transaction reference number
     */
    reference?: string;
    /**
     * Type of transaction (e.g., PURCHASE, WITHDRAWAL)
     */
    transactionType?: string;
};

