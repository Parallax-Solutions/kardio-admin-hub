/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TestParserConfigDto = {
    /**
     * Parser rules to test
     */
    rules: Record<string, any>;
    /**
     * Sample email HTML to test against
     */
    sampleEmailHtml: string;
    /**
     * Optional email subject for testing
     */
    subject?: string;
    /**
     * Optional sender email for testing
     */
    from?: string;
    /**
     * Optional email sender patterns to test matching
     */
    emailSenderPatterns?: Array<string>;
    /**
     * Optional subject patterns to test matching
     */
    subjectPatterns?: Array<string>;
};

