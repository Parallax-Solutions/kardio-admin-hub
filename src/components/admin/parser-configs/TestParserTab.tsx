import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';
import { Code2, Play, Loader2, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import type { Bank } from '@/stores/banksStore';
import type { ParserConfigFormState } from '@/hooks/useParserConfigEditor';

interface TestResult {
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

interface TestParserTabProps {
  testHtml: string;
  setTestHtml: (html: string) => void;
  testLoading: boolean;
  handleTestParser: () => void;
  testResult: TestResult | null;
  copyResultToClipboard: () => void;
  banks: Bank[];
  form: ParserConfigFormState;
}

export function TestParserTab({
  testHtml,
  setTestHtml,
  testLoading,
  handleTestParser,
  testResult,
  copyResultToClipboard,
  banks,
  form,
}: TestParserTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 pb-20 lg:pb-0">
      {/* Input Section */}
      <div className="space-y-4">
        {/* HTML Input */}
        <Card className="shadow-card">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                <CardTitle className="text-sm sm:text-lg">Email HTML</CardTitle>
              </div>
              <Button
                onClick={handleTestParser}
                disabled={testLoading || !testHtml.trim()}
                size="sm"
                className="gap-1.5 h-8 text-xs sm:h-9 sm:text-sm"
              >
                {testLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Paste the raw HTML content of the bank email
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <CodeEditor
              value={testHtml}
              onChange={setTestHtml}
              language="markup"
              formatOnPaste
              cleanOnPaste
              showValidation
              maxHeight="400px"
              placeholder="<!-- Paste your email HTML here -->"
              minHeight="350px"
            />
            <p className="mt-2 text-[10px] text-muted-foreground sm:text-xs">
              {testHtml.length.toLocaleString()} characters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {/* Current Config Summary */}
        <Card className="shadow-card">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <CardTitle className="text-sm sm:text-lg">Parser Config Summary</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              This configuration will be sent to the backend
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">{banks.find(b => b.id === form.bankId)?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy:</span>
                <span className="font-medium">{form.strategy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fields:</span>
                <span className="font-medium">{form.fields.length} defined</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validations:</span>
                <span className="font-medium">{form.validations.length} rules</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="shadow-card">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testResult ? (
                  testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive sm:h-5 sm:w-5" />
                  )
                ) : (
                  <Code2 className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
                )}
                <CardTitle className="text-sm sm:text-lg">Extraction Results</CardTitle>
              </div>
              {testResult?.success && testResult.extractedData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyResultToClipboard}
                  className="gap-1.5 h-8 text-xs sm:h-9 sm:text-sm"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Copy
                </Button>
              )}
            </div>
            <CardDescription className="text-xs sm:text-sm">
              {testResult
                ? testResult.success
                  ? `Extracted ${testResult.extractedFields.length} fields`
                  : `${testResult.errors.length} error(s) occurred`
                : 'Run a test to see extracted data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {testLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Processing...</p>
                </div>
              </div>
            ) : testResult ? (
              <div className="space-y-4">
                {/* Pattern Matches */}
                <div className="flex gap-3 text-xs">
                  <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${testResult.patternMatches.senderMatched ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {testResult.patternMatches.senderMatched ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    Sender
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${testResult.patternMatches.subjectMatched ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {testResult.patternMatches.subjectMatched ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    Subject
                  </div>
                </div>

                {/* Errors */}
                {testResult.errors.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                    <p className="text-xs font-medium text-destructive mb-1">Errors</p>
                    <ul className="space-y-1">
                      {testResult.errors.map((err, i) => (
                        <li key={i} className="text-xs text-destructive/80">• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {testResult.warnings.length > 0 && (
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                    <p className="text-xs font-medium text-yellow-600 mb-1">Warnings</p>
                    <ul className="space-y-1">
                      {testResult.warnings.map((warn, i) => (
                        <li key={i} className="text-xs text-yellow-600/80">• {warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Fields */}
                {testResult.missingFields.length > 0 && (
                  <div className="rounded-lg border border-muted bg-muted/30 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Missing Fields</p>
                    <div className="flex flex-wrap gap-1.5">
                      {testResult.missingFields.map((field, i) => (
                        <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{field}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Data */}
                {testResult.extractedData && (
                  <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
                    <div className="border-b border-border bg-muted/50 px-3 py-2">
                      <p className="text-xs font-medium">Extracted Data</p>
                    </div>
                    <div className="divide-y divide-border">
                      {Object.entries(testResult.extractedData).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between px-3 py-2 text-xs">
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
              <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
                <Play className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <h4 className="mb-1 text-sm font-medium">No test results yet</h4>
                <p className="text-xs text-muted-foreground">
                  Paste an email HTML and click "Run Test" to see extracted data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
