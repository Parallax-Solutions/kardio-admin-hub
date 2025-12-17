/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTransactionCategoryDto = {
    /**
     * The category ID to assign
     */
    categoryId: string;
    /**
     * If true, apply this category to all transactions from the same merchant for this user
     */
    applyToAllMerchantTransactions: boolean;
};

