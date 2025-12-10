/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCurrencyDto = {
    /**
     * ISO 4217 currency code (3 uppercase letters)
     */
    code: string;
    /**
     * Currency name
     */
    name: string;
    /**
     * Currency status
     */
    status?: CreateCurrencyDto.status;
};
export namespace CreateCurrencyDto {
    /**
     * Currency status
     */
    export enum status {
        ACTIVE = 'ACTIVE',
        PENDING = 'PENDING',
        DEPRECATED = 'DEPRECATED',
    }
}

