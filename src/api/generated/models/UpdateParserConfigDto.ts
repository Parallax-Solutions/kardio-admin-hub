/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateParserConfigDto = {
    /**
     * Bank ID to associate this parser config with
     */
    bankId?: string;
    /**
     * Type of email this parser handles
     */
    emailKind?: UpdateParserConfigDto.emailKind;
    /**
     * Semantic version of the parser config
     */
    version?: string;
    /**
     * Parsing strategy to use
     */
    strategy?: UpdateParserConfigDto.strategy;
    /**
     * Whether this config is active
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
     * Rule-based parsing configuration
     */
    rules?: Record<string, any>;
    /**
     * AI parsing configuration
     */
    aiConfig?: Record<string, any>;
};
export namespace UpdateParserConfigDto {
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
    /**
     * Parsing strategy to use
     */
    export enum strategy {
        RULE_BASED = 'RULE_BASED',
        AI = 'AI',
        HYBRID = 'HYBRID',
    }
}

