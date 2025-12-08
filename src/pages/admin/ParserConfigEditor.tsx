import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Settings2, Code2, ShieldCheck, Sparkles, ChevronDown, Play, Loader2, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/admin/PageHeader';
import { TagInput } from '@/components/admin/TagInput';
import { FieldCard, ParserField } from '@/components/admin/FieldCard';
import { ValidationRow, Validation } from '@/components/admin/ValidationRow';
import { mockBanks } from '@/data/mockData';
import { toast } from 'sonner';

interface AIConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

interface ParserConfigForm {
  bankId: string;
  version: string;
  strategy: 'RULE_BASED' | 'AI' | 'HYBRID';
  emailKind: string;
  senderPatterns: string[];
  subjectPatterns: string[];
  fields: ParserField[];
  validations: Validation[];
  aiConfig: AIConfig;
}

const EMAIL_KINDS = [
  'Transaction notification',
  'Statement ready',
  'Balance alert',
  'Security alert',
  'Payment confirmation',
  'Transfer notification',
];

export default function ParserConfigEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('config');
  const [form, setForm] = useState<ParserConfigForm>({
    bankId: '',
    version: 'v1.0',
    strategy: 'RULE_BASED',
    emailKind: '',
    senderPatterns: [],
    subjectPatterns: [],
    fields: [],
    validations: [],
    aiConfig: {
      model: 'gpt-4o-mini',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 1000,
    },
  });

  const [aiConfigOpen, setAiConfigOpen] = useState(false);

  // Test tab state
  const [testHtml, setTestHtml] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
  } | null>(null);

  const addField = () => {
    const newField: ParserField = {
      id: crypto.randomUUID(),
      name: '',
      required: false,
      defaultValue: '',
      transform: '',
      extractors: [],
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const updateField = (index: number, field: ParserField) => {
    const updated = [...form.fields];
    updated[index] = field;
    setForm({ ...form, fields: updated });
  };

  const removeField = (index: number) => {
    setForm({ ...form, fields: form.fields.filter((_, i) => i !== index) });
  };

  const addValidation = () => {
    const newValidation: Validation = {
      id: crypto.randomUUID(),
      field: '',
      ruleType: 'REQUIRED',
      value: '',
      errorMessage: '',
    };
    setForm({ ...form, validations: [...form.validations, newValidation] });
  };

  const updateValidation = (index: number, validation: Validation) => {
    const updated = [...form.validations];
    updated[index] = validation;
    setForm({ ...form, validations: updated });
  };

  const removeValidation = (index: number) => {
    setForm({ ...form, validations: form.validations.filter((_, i) => i !== index) });
  };

  const jsonPreview = useMemo(() => {
    const bank = mockBanks.find((b) => b.id === form.bankId);
    return {
      bank: bank?.name || null,
      version: form.version,
      strategy: form.strategy,
      emailKind: form.emailKind || null,
      senderPatterns: form.senderPatterns,
      subjectPatterns: form.subjectPatterns,
      fields: form.fields.map((f) => ({
        name: f.name || null,
        required: f.required,
        defaultValue: f.defaultValue || null,
        transform: f.transform || null,
        extractors: f.extractors.map((e) => ({
          type: e.type,
          pattern: e.pattern,
          flags: e.flags || undefined,
          captureGroup: e.captureGroup,
        })),
      })),
      validations: form.validations.map((v) => ({
        field: v.field || null,
        ruleType: v.ruleType,
        value: v.value || null,
        errorMessage: v.errorMessage || null,
      })),
      aiConfig: form.strategy !== 'RULE_BASED' ? form.aiConfig : undefined,
    };
  }, [form]);

  const handleSave = () => {
    toast.success('Parser config saved successfully!');
    navigate('/admin/parser-configs');
  };

  const handleTestParser = async () => {
    if (!testHtml.trim()) {
      toast.error('Please paste the email HTML content');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      // TODO: Replace with actual backend endpoint
      const BACKEND_ENDPOINT = '/api/parse-email';
      
      const response = await fetch(BACKEND_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: testHtml,
          parserConfig: jsonPreview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTestResult({
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        });
      } else {
        setTestResult({
          success: true,
          data: data,
        });
        toast.success('Parser test completed successfully!');
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to endpoint',
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyResultToClipboard = () => {
    if (testResult?.data) {
      navigator.clipboard.writeText(JSON.stringify(testResult.data, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8 sm:space-y-6 sm:pb-12">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => navigate('/admin/parser-configs')}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <PageHeader
          title={isEditing ? 'Edit Parser Config' : 'Create Parser Config'}
          description="Define how to extract transaction data from bank emails."
        />
      </div>

      {/* Mobile Save Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background p-3 lg:hidden">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 text-sm"
            onClick={() => navigate('/admin/parser-configs')}
          >
            Cancel
          </Button>
          <Button className="flex-1 h-10 gap-1.5 text-sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Tabs for Config / Test */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
          <TabsTrigger value="config" className="gap-1.5 text-xs sm:text-sm">
            <Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-1.5 text-xs sm:text-sm">
            <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Test Parser
          </TabsTrigger>
        </TabsList>

        {/* Config Tab */}
        <TabsContent value="config" className="mt-4 sm:mt-6">
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {/* Main Form */}
            <div className="space-y-4 lg:col-span-2 lg:space-y-6 pb-20 lg:pb-0">
              {/* General Settings */}
              <Card className="shadow-card">
                <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    <CardTitle className="text-sm sm:text-lg">General Settings</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Basic configuration for this parser
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 sm:p-6 sm:pt-0 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">Bank</Label>
                      <Select
                        value={form.bankId}
                        onValueChange={(value) => setForm({ ...form, bankId: value })}
                      >
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBanks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">Version</Label>
                      <Input
                        value={form.version}
                        onChange={(e) => setForm({ ...form, version: e.target.value })}
                        placeholder="e.g. v1.0"
                        className="h-9 text-sm sm:h-10"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">Strategy</Label>
                      <Select
                        value={form.strategy}
                        onValueChange={(value: ParserConfigForm['strategy']) =>
                          setForm({ ...form, strategy: value })
                        }
                      >
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RULE_BASED">Rule Based</SelectItem>
                          <SelectItem value="AI">AI</SelectItem>
                          <SelectItem value="HYBRID">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">Email Kind</Label>
                      <Select
                        value={form.emailKind}
                        onValueChange={(value) => setForm({ ...form, emailKind: value })}
                      >
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMAIL_KINDS.map((kind) => (
                            <SelectItem key={kind} value={kind}>
                              {kind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">Sender Patterns (Regex)</Label>
                    <TagInput
                      tags={form.senderPatterns}
                      onChange={(tags) => setForm({ ...form, senderPatterns: tags })}
                      placeholder="Type pattern + Enter"
                    />
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      Regex patterns to match the sender email address
                    </p>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm">Subject Patterns (Regex)</Label>
                    <TagInput
                      tags={form.subjectPatterns}
                      onChange={(tags) => setForm({ ...form, subjectPatterns: tags })}
                      placeholder="Type pattern + Enter"
                    />
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      Regex patterns to match the email subject line
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Fields & Extractors */}
              <Card className="shadow-card">
                <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      <CardTitle className="text-sm sm:text-lg">Fields & Extractors</CardTitle>
                    </div>
                    <Button onClick={addField} size="sm" className="gap-1 h-8 text-xs sm:gap-1.5 sm:h-9 sm:text-sm">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Add Field</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Define which fields to extract and how
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  {form.fields.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center sm:rounded-xl sm:p-8">
                      <Code2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50 sm:mb-3 sm:h-10 sm:w-10" />
                      <h4 className="mb-1 text-sm font-medium">No fields defined</h4>
                      <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
                        Add fields to start extracting data
                      </p>
                      <Button onClick={addField} variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Add Your First Field
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {form.fields.map((field, index) => (
                        <FieldCard
                          key={field.id}
                          field={field}
                          index={index}
                          onChange={(updated) => updateField(index, updated)}
                          onRemove={() => removeField(index)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Validations */}
              <Card className="shadow-card">
                <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      <CardTitle className="text-sm sm:text-lg">Validations</CardTitle>
                    </div>
                    <Button onClick={addValidation} variant="outline" size="sm" className="gap-1 h-8 text-xs sm:gap-1.5 sm:h-9 sm:text-sm">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Add Rule</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Define validation rules for extracted fields
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  {form.validations.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center sm:p-6">
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        No validation rules defined yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="hidden grid-cols-12 gap-2 px-2 text-xs font-medium text-muted-foreground sm:grid">
                        <div className="col-span-3">Field</div>
                        <div className="col-span-2">Rule</div>
                        <div className="col-span-2">Value</div>
                        <div className="col-span-4">Error Message</div>
                        <div className="col-span-1"></div>
                      </div>
                      {form.validations.map((validation, index) => (
                        <ValidationRow
                          key={validation.id}
                          validation={validation}
                          onChange={(updated) => updateValidation(index, updated)}
                          onRemove={() => removeValidation(index)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Config */}
              {(form.strategy === 'AI' || form.strategy === 'HYBRID') && (
                <Card className="shadow-card">
                  <Collapsible open={aiConfigOpen} onOpenChange={setAiConfigOpen}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer p-4 pb-3 transition-colors hover:bg-muted/30 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
                            <CardTitle className="text-sm sm:text-lg">AI Configuration</CardTitle>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform sm:h-5 sm:w-5 ${
                              aiConfigOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        <CardDescription className="text-xs sm:text-sm">
                          Configure AI model settings for extraction
                        </CardDescription>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6 sm:pt-0">
                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm">Model</Label>
                            <Input
                              value={form.aiConfig.model}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  aiConfig: { ...form.aiConfig, model: e.target.value },
                                })
                              }
                              placeholder="e.g. gpt-4o-mini"
                              className="h-9 text-sm sm:h-10"
                            />
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm">Max Tokens</Label>
                            <Input
                              type="number"
                              value={form.aiConfig.maxTokens}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  aiConfig: {
                                    ...form.aiConfig,
                                    maxTokens: parseInt(e.target.value) || 1000,
                                  },
                                })
                              }
                              className="h-9 text-sm sm:h-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-xs sm:text-sm">Temperature: {form.aiConfig.temperature.toFixed(1)}</Label>
                          <Slider
                            value={[form.aiConfig.temperature]}
                            onValueChange={([value]) =>
                              setForm({
                                ...form,
                                aiConfig: { ...form.aiConfig, temperature: value },
                              })
                            }
                            min={0}
                            max={2}
                            step={0.1}
                            className="w-full"
                          />
                          <p className="text-[10px] text-muted-foreground sm:text-xs">
                            Lower values make output more deterministic
                          </p>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label className="text-xs sm:text-sm">System Prompt</Label>
                          <Textarea
                            value={form.aiConfig.systemPrompt}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                aiConfig: { ...form.aiConfig, systemPrompt: e.target.value },
                              })
                            }
                            placeholder="You are an expert at parsing bank transaction emails..."
                            rows={3}
                            className="text-sm"
                          />
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )}
            </div>

            {/* JSON Preview Sidebar - Desktop */}
            <div className="hidden lg:col-span-1 lg:block">
              <div className="sticky top-6">
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">JSON Preview</CardTitle>
                    <CardDescription className="text-xs">
                      Live preview of parser config
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="max-h-[calc(100vh-300px)] overflow-auto rounded-lg bg-sidebar p-4 text-xs text-sidebar-foreground">
                      <code>{JSON.stringify(jsonPreview, null, 2)}</code>
                    </pre>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/admin/parser-configs')}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 gap-1.5" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="mt-4 sm:mt-6">
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
                  <Textarea
                    value={testHtml}
                    onChange={(e) => setTestHtml(e.target.value)}
                    placeholder="<html>&#10;  <body>&#10;    <!-- Paste your email HTML here -->&#10;  </body>&#10;</html>"
                    className="min-h-[300px] font-mono text-xs sm:min-h-[400px] sm:text-sm"
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
                      <span className="font-medium">{mockBanks.find(b => b.id === form.bankId)?.name || 'Not selected'}</span>
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
                    {testResult?.success && testResult.data && (
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
                        ? 'Successfully extracted data from the email'
                        : 'Failed to extract data'
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
                    testResult.success ? (
                      <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
                        <pre className="max-h-[400px] overflow-auto p-3 text-xs leading-relaxed text-foreground sm:p-4 sm:text-sm">
                          <code className="whitespace-pre-wrap break-words">
                            {JSON.stringify(testResult.data, null, 2)}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-destructive">Error</p>
                            <p className="mt-1 text-xs text-destructive/80">{testResult.error}</p>
                          </div>
                        </div>
                      </div>
                    )
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
