import { useState } from 'react';
import { Play, Loader2, AlertCircle, CheckCircle2, Copy, Code2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeEditor } from '@/components/ui/code-editor';
import { useTestParser, type ParserConfig } from '@/stores';
import { toast } from 'sonner';

interface TestParserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: ParserConfig | null;
  bankName: string;
}

interface TestResult {
  success: boolean;
  extractedData: Record<string, unknown> | null;
  extractedFields: string[];
  missingFields: string[];
  errors: string[];
  warnings: string[];
  patternMatches: {
    senderMatched: boolean;
    subjectMatched: boolean;
  };
}

export function TestParserDialog({ open, onOpenChange, config, bankName }: TestParserDialogProps) {
  const testParser = useTestParser();
  const [testHtml, setTestHtml] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleTestParser = async () => {
    if (!testHtml.trim() || !config) {
      toast.error('Please paste the email HTML content');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      const rules = config.rules as { 
        fields?: Array<{ 
          fieldName?: string; 
          name?: string; 
          required?: boolean; 
          defaultValue?: string; 
          transform?: { type: string; locale?: string; dateFormat?: string; layout?: string[]; optionalTokens?: string[] }; 
          extractors?: Array<{ type: string; pattern: string; flags?: string; captureGroup?: number }> 
        }>; 
        validations?: Array<{ field: string; rule: string; value?: any; errorMessage?: string }> 
      };

      const payload = {
        rules: {
          fields: (rules?.fields || []).map((f) => ({
            fieldName: f.fieldName || f.name,
            required: f.required,
            defaultValue: f.defaultValue || undefined,
            transform: f.transform || undefined,
            extractors: (f.extractors || []).map((e) => ({
              type: e.type,
              pattern: e.pattern,
              flags: e.flags || undefined,
              captureGroup: e.captureGroup,
            })),
          })),
          validations: (rules?.validations || []).map((v) => ({
            field: v.field,
            rule: v.rule,
            value: v.value || undefined,
            errorMessage: v.errorMessage || undefined,
          })),
        },
        sampleEmailHtml: testHtml,
        emailSenderPatterns: config.emailSenderPatterns || [],
        subjectPatterns: config.subjectPatterns || [],
      };

      const response = await testParser.mutateAsync(payload);
      const result = response as {
        data?: {
          success?: boolean;
          extractedData?: Record<string, unknown>;
          extractedFields?: string[];
          missingFields?: string[];
          errors?: string[];
          warnings?: string[];
          patternMatches?: { senderMatched: boolean; subjectMatched: boolean };
        };
        success?: boolean;
        extractedData?: Record<string, unknown>;
        extractedFields?: string[];
        missingFields?: string[];
        errors?: string[];
        warnings?: string[];
        patternMatches?: { senderMatched: boolean; subjectMatched: boolean };
      };
      
      const data = result?.data ?? result;

      setTestResult({
        success: data?.success ?? false,
        extractedData: data?.extractedData ?? null,
        extractedFields: data?.extractedFields ?? [],
        missingFields: data?.missingFields ?? [],
        errors: data?.errors ?? [],
        warnings: data?.warnings ?? [],
        patternMatches: data?.patternMatches ?? { senderMatched: false, subjectMatched: false },
      });

      if (data?.success) {
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
      setTestLoading(false);
    }
  };

  const copyResultToClipboard = () => {
    if (testResult?.extractedData) {
      navigator.clipboard.writeText(JSON.stringify(testResult.extractedData, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setTestHtml('');
      setTestResult(null);
    }
    onOpenChange(newOpen);
  };

  if (!config) return null;

  const rules = config.rules as { fields?: unknown[]; validations?: unknown[] };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Test Parser - v{config.version}
          </DialogTitle>
          <DialogDescription>
            Test the parser configuration for {bankName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-2 overflow-auto flex-1 py-2">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Config Summary */}
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">Parser Config Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium">{bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Strategy:</span>
                    <span className="font-medium">{config.strategy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fields:</span>
                    <span className="font-medium">{rules?.fields?.length || 0} defined</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validations:</span>
                    <span className="font-medium">{rules?.validations?.length || 0} rules</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HTML Input */}
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">Email HTML</CardTitle>
                  </div>
                  <Button
                    onClick={handleTestParser}
                    disabled={testLoading || !testHtml.trim()}
                    size="sm"
                    className="gap-1.5 h-7 text-xs"
                  >
                    {testLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Run Test
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Paste the raw HTML content of the bank email
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <CodeEditor
                  value={testHtml}
                  onChange={setTestHtml}
                  language="markup"
                  formatOnPaste
                  cleanOnPaste
                  showValidation
                  maxHeight="250px"
                  placeholder="<!-- Paste your email HTML here -->"
                  minHeight="200px"
                />
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  {testHtml.length.toLocaleString()} characters
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {testResult ? (
                      testResult.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )
                    ) : (
                      <Code2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    <CardTitle className="text-sm">Extraction Results</CardTitle>
                  </div>
                  {testResult?.success && testResult.extractedData && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyResultToClipboard}
                      className="gap-1.5 h-7 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {testResult
                    ? testResult.success
                      ? `Extracted ${testResult.extractedFields.length} fields`
                      : `${testResult.errors.length} error(s) occurred`
                    : 'Run a test to see extracted data'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {testLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                      <p className="mt-2 text-xs text-muted-foreground">Processing...</p>
                    </div>
                  </div>
                ) : testResult ? (
                  <div className="space-y-3 max-h-[300px] overflow-auto">
                    {/* Pattern Matches */}
                    <div className="flex gap-2 text-xs">
                      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${testResult.patternMatches.senderMatched ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                        {testResult.patternMatches.senderMatched ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Sender
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${testResult.patternMatches.subjectMatched ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                        {testResult.patternMatches.subjectMatched ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        Subject
                      </div>
                    </div>

                    {/* Errors */}
                    {testResult.errors.length > 0 && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2">
                        <p className="text-xs font-medium text-destructive mb-1">Errors</p>
                        <ul className="space-y-0.5">
                          {testResult.errors.map((err, i) => (
                            <li key={i} className="text-xs text-destructive/80">• {err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {testResult.warnings.length > 0 && (
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2">
                        <p className="text-xs font-medium text-yellow-600 mb-1">Warnings</p>
                        <ul className="space-y-0.5">
                          {testResult.warnings.map((warn, i) => (
                            <li key={i} className="text-xs text-yellow-600/80">• {warn}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Fields */}
                    {testResult.missingFields.length > 0 && (
                      <div className="rounded-lg border border-muted bg-muted/30 p-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Missing Fields</p>
                        <div className="flex flex-wrap gap-1">
                          {testResult.missingFields.map((field, i) => (
                            <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">{field}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Data */}
                    {testResult.extractedData && (
                      <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
                        <div className="border-b border-border bg-muted/50 px-2 py-1.5">
                          <p className="text-xs font-medium">Extracted Data</p>
                        </div>
                        <div className="divide-y divide-border max-h-[200px] overflow-auto">
                          {Object.entries(testResult.extractedData).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between px-2 py-1.5 text-xs">
                              <span className="font-mono text-muted-foreground">{key}</span>
                              <span className={`font-medium ${value === null ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                                {value === null ? 'null' : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                    <Play className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    <h4 className="mb-1 text-sm font-medium">No test results yet</h4>
                    <p className="text-xs text-muted-foreground">
                      Paste an email HTML and click "Run Test"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
