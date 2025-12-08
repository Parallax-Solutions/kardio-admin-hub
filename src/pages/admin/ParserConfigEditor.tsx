import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Settings2, Code2, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/parser-configs')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title={isEditing ? 'Edit Parser Config' : 'Create Parser Config'}
          description="Define how to extract transaction data from bank notification emails."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Settings */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">General Settings</CardTitle>
              </div>
              <CardDescription>
                Basic configuration for this parser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Select
                    value={form.bankId}
                    onValueChange={(value) => setForm({ ...form, bankId: value })}
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    placeholder="e.g. v1.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select
                    value={form.strategy}
                    onValueChange={(value: ParserConfigForm['strategy']) =>
                      setForm({ ...form, strategy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RULE_BASED">Rule Based</SelectItem>
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Email Kind</Label>
                  <Select
                    value={form.emailKind}
                    onValueChange={(value) => setForm({ ...form, emailKind: value })}
                  >
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Sender Patterns (Regex)</Label>
                <TagInput
                  tags={form.senderPatterns}
                  onChange={(tags) => setForm({ ...form, senderPatterns: tags })}
                  placeholder="Type regex pattern and press Enter"
                />
                <p className="text-xs text-muted-foreground">
                  Regex patterns to match the sender email address
                </p>
              </div>

              <div className="space-y-2">
                <Label>Subject Patterns (Regex)</Label>
                <TagInput
                  tags={form.subjectPatterns}
                  onChange={(tags) => setForm({ ...form, subjectPatterns: tags })}
                  placeholder="Type regex pattern and press Enter"
                />
                <p className="text-xs text-muted-foreground">
                  Regex patterns to match the email subject line
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fields & Extractors */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Fields & Extractors</CardTitle>
                </div>
                <Button onClick={addField} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>
              <CardDescription>
                Define which fields to extract and how to extract them
              </CardDescription>
            </CardHeader>
            <CardContent>
              {form.fields.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
                  <Code2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <h4 className="mb-1 font-medium">No fields defined</h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Add fields to start extracting data from emails
                  </p>
                  <Button onClick={addField} variant="outline" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add Your First Field
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
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
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Validations</CardTitle>
                </div>
                <Button onClick={addValidation} variant="outline" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add Rule
                </Button>
              </div>
              <CardDescription>
                Define validation rules for extracted fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              {form.validations.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No validation rules defined yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-2 text-xs font-medium text-muted-foreground">
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
                  <CardHeader className="cursor-pointer pb-4 transition-colors hover:bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg">AI Configuration</CardTitle>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          aiConfigOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <CardDescription>
                      Configure AI model settings for extraction
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Input
                          value={form.aiConfig.model}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              aiConfig: { ...form.aiConfig, model: e.target.value },
                            })
                          }
                          placeholder="e.g. gpt-4o-mini"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Max Tokens</Label>
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Temperature: {form.aiConfig.temperature.toFixed(1)}</Label>
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
                      <p className="text-xs text-muted-foreground">
                        Lower values make output more deterministic
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>System Prompt</Label>
                      <Textarea
                        value={form.aiConfig.systemPrompt}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            aiConfig: { ...form.aiConfig, systemPrompt: e.target.value },
                          })
                        }
                        placeholder="You are an expert at parsing bank transaction emails..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}
        </div>

        {/* JSON Preview Sidebar */}
        <div className="lg:col-span-1">
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
    </div>
  );
}
