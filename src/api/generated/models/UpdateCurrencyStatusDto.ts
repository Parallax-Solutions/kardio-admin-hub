/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCurrencyStatusDto = {
    /**
     * New status for the currency
     */
    status: UpdateCurrencyStatusDto.status;
};
export namespace UpdateCurrencyStatusDto {
    /**
     * New status for the currency
     */
    export enum status {
        ACTIVE = 'ACTIVE',
        PENDING = 'PENDING',
        DEPRECATED = 'DEPRECATED',
    }
}

