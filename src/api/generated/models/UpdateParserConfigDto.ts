/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateParserConfigDto = {
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
    /**
     * Sample email HTML for testing parser rules
     */
    sampleEmailHtml?: string;
};
export namespace UpdateParserConfigDto {
    /**
     * Parsing strategy to use
     */
    export enum strategy {
        RULE_BASED = 'RULE_BASED',
        AI = 'AI',
        HYBRID = 'HYBRID',
    }
}

