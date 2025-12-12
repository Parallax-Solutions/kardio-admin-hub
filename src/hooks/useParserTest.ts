import { useState } from 'react';
import { toast } from 'sonner';
import { useTestParser } from '@/stores';
import type { ParserConfigFormState } from './useParserConfigEditor';

export interface TestResult {
  success: boolean;
  extractedData: Record<string, any> | null;
  extractedFields: string[];
  missingFields: string[];
  errors: string[];
  warnings: string[];
  patternMatches: {
    senderMatched: boolean;
    subjectMatched: boolean;
  };
}

export function useParserTest() {
  const testParserMutation = useTestParser();
  const [testHtml, setTestHtml] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  // We can track loading state via mutation or local state if we want fine control
  const [isTestRunning, setIsTestRunning] = useState(false);

  const runTest = async (form: ParserConfigFormState) => {
    if (!testHtml.trim()) {
      toast.error('Please paste the email HTML content');
      return;
    }

    setIsTestRunning(true);
    setTestResult(null);

    try {
      const payload = {
        rules: {
          fields: form.fields.map((f) => ({
            fieldName: f.fieldName,
            required: f.required,
            defaultValue: f.defaultValue || undefined,
            transform: f.transform || undefined,
            extractors: f.extractors.map((e) => ({
              type: e.type,
              pattern: e.pattern,
              flags: e.flags || undefined,
              captureGroup: e.captureGroup,
            })),
          })),
          validations: form.validations.map((v) => ({
            field: v.field,
            rule: v.rule,
            value: v.value || undefined,
            errorMessage: v.errorMessage || undefined,
          })),
        },
        sampleEmailHtml: testHtml,
        emailSenderPatterns: form.senderPatterns,
        subjectPatterns: form.subjectPatterns,
      };

      console.log('Test payload:', payload);
      const response = await testParserMutation.mutateAsync(payload);
      console.log('Test response:', response);

      // The response is already unwrapped by the service layer to return { success, data, ... } or similar structure
      // However, check if service layer unwraps it completely or returns the envelope
      // In src/api/services/parserConfigsService.ts: testParserConfig returns unwrapData<unknown>(response)
      // unwrapData returns response.data if it exists, or response.
      // So if backend returns { success: true, data: {...} }, unwrapData returns { ... } if data exists? 
      // Wait, unwrapData implementation:
      // if (response && typeof response === 'object' && 'data' in response) return response.data;
      // If the backend response IS the data (which is common in some clean arch setups), then it's fine.
      // But looking at previous code in ParserConfigEditor.tsx: 
      // const r = response as any; const result = r?.data ?? r;
      // It seems the "data" field might contain the result object { success, extractedData, ... } OR the result object is the response.
      // Let's assume the service layer now returns the inner data. 
      // If the service `testParserConfig` returns `unwrapData(response)`, and the API returns `{ data: { success: true, ... } }`, then `response` here is `{ success: true, ... }`.
      
      const result = response as any;

      setTestResult({
        success: result?.success ?? false,
        extractedData: result?.extractedData ?? result?.data ?? null,
        extractedFields: result?.extractedFields ?? [],
        missingFields: result?.missingFields ?? [],
        errors: result?.errors ?? [],
        warnings: result?.warnings ?? [],
        patternMatches: result?.patternMatches ?? { senderMatched: false, subjectMatched: false },
      });

      if (result?.success) {
        toast.success('Parser test completed successfully!');
      }
    } catch (error) {
      setTestResult({
        success: false,
        extractedData: null,
        extractedFields: [],
        missingFields: [],
        errors: [error instanceof Error ? error.message : 'Failed to test parser'],
        warnings: [],
        patternMatches: { senderMatched: false, subjectMatched: false },
      });
      toast.error('Parser test failed');
    } finally {
      setIsTestRunning(false);
    }
  };

  const copyResultToClipboard = () => {
    if (testResult?.extractedData) {
      navigator.clipboard.writeText(JSON.stringify(testResult.extractedData, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  return {
    testHtml,
    setTestHtml,
    testResult,
    testLoading: isTestRunning,
    runTest,
    copyResultToClipboard,
  };
}
