/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CategoriesFiltersSchema = {
    /**
     * Category type filter
     */
    type?: CategoriesFiltersSchema.type;
    /**
     * Search keyword
     */
    search?: string;
};
export namespace CategoriesFiltersSchema {
    /**
     * Category type filter
     */
    export enum type {
        INCOME = 'income',
        EXPENSE = 'expense',
    }
}

