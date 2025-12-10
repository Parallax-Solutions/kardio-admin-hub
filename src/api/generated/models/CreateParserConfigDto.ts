/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateParserConfigDto = {
    /**
     * Bank ID to associate this parser config with
     */
    bankId: string;
    /**
     * Semantic version of the parser config
     */
    version: string;
    /**
     * Parsing strategy to use
     */
    strategy: CreateParserConfigDto.strategy;
    /**
     * Type of email this parser handles
     */
    emailKind: CreateParserConfigDto.emailKind;
    /**
     * Whether this config should be active (only one per bank)
     */
    isActive?: boolean;
    /**
     * Regex patterns to match email sender
     */
    emailSenderPatterns?: Array<string>;
    /**
     * Regex patterns to match email subject
     */
    subjectPatterns?: Array<string>;
    /**
     * Rule-based parsing configuration (JSON object)
     */
    rules?: Record<string, any>;
    /**
     * AI parsing configuration
     */
    aiConfig?: Record<string, any>;
};
export namespace CreateParserConfigDto {
    /**
     * Parsing strategy to use
     */
    export enum strategy {
        RULE_BASED = 'RULE_BASED',
        AI = 'AI',
        HYBRID = 'HYBRID',
    }
    /**
     * Type of email this parser handles
     */
    export enum emailKind {
        TRANSACTION_NOTIFICATION = 'TRANSACTION_NOTIFICATION',
        STATEMENT = 'STATEMENT',
        BALANCE_ALERT = 'BALANCE_ALERT',
        SECURITY_ALERT = 'SECURITY_ALERT',
        PROMOTIONAL = 'PROMOTIONAL',
        OTHER = 'OTHER',
    }
}

