/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SortMetaSchema = {
    /**
     * Field used for sorting
     */
    sortBy: string;
    /**
     * Sort direction
     */
    sortOrder: SortMetaSchema.sortOrder;
};
export namespace SortMetaSchema {
    /**
     * Sort direction
     */
    export enum sortOrder {
        ASC = 'asc',
        DESC = 'desc',
    }
}

