import { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Settings2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/admin/PageHeader';
import { useBanks, useParserConfig, useCreateParserConfig, useUpdateParserConfig } from '@/stores';
import { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';
import { toast } from 'sonner';

import { useParserConfigEditor } from '@/hooks/useParserConfigEditor';
import { useParserTest } from '@/hooks/useParserTest';

import { GeneralSettingsCard } from '@/components/admin/parser-configs/GeneralSettingsCard';
import { FieldsSettingsCard } from '@/components/admin/parser-configs/FieldsSettingsCard';
import { ValidationsSettingsCard } from '@/components/admin/parser-configs/ValidationsSettingsCard';
import { AIConfigSettingsCard } from '@/components/admin/parser-configs/AIConfigSettingsCard';
import { JsonPreviewCard } from '@/components/admin/parser-configs/JsonPreviewCard';
import { TestParserTab } from '@/components/admin/parser-configs/TestParserTab';

const EMAIL_KIND_LABELS: Record<CreateParserConfigDto['emailKind'], string> = {
  [CreateParserConfigDto.emailKind.TRANSACTION_NOTIFICATION]: 'Transaction Notification',
  [CreateParserConfigDto.emailKind.STATEMENT]: 'Statement',
  [CreateParserConfigDto.emailKind.BALANCE_ALERT]: 'Balance Alert',
  [CreateParserConfigDto.emailKind.SECURITY_ALERT]: 'Security Alert',
  [CreateParserConfigDto.emailKind.PROMOTIONAL]: 'Promotional',
  [CreateParserConfigDto.emailKind.OTHER]: 'Other',
};

export default function ParserConfigEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Data hooks
  const { data: banks = [], isLoading: banksLoading } = useBanks();
  const { data: existingConfig, isLoading: configLoading } = useParserConfig(id);
  const createConfig = useCreateParserConfig();
  const updateConfig = useUpdateParserConfig();

  // Editor State Hook
  const {
    form,
    setForm,
    aiConfigOpen,
    setAiConfigOpen,
    newlyAddedFieldId,
    loadedSampleEmailHtml,
    addField,
    updateField,
    removeField,
    addValidation,
    updateValidation,
    removeValidation,
  } = useParserConfigEditor({ isEditing, existingConfig });

  // Test Logic Hook
  const {
    testHtml,
    setTestHtml,
    testResult,
    testLoading,
    runTest,
    copyResultToClipboard,
  } = useParserTest();

  // Sync loaded sample email to test html
  useEffect(() => {
    if (loadedSampleEmailHtml) {
      setTestHtml(loadedSampleEmailHtml);
    }
  }, [loadedSampleEmailHtml, setTestHtml]);

  const isLoading = banksLoading || (isEditing && configLoading);

  const jsonPreview = useMemo(() => {
    const bank = banks.find((b) => b.id === form.bankId);
    return {
      bank: bank?.name || null,
      version: form.version,
      strategy: form.strategy,
      emailKind: form.emailKind || null,
      senderPatterns: form.senderPatterns,
      subjectPatterns: form.subjectPatterns,
      fields: form.fields.map((f) => ({
        fieldName: f.fieldName || null,
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
        rule: v.rule,
        value: v.value || undefined,
        errorMessage: v.errorMessage || undefined,
      })),
      aiConfig: form.strategy !== CreateParserConfigDto.strategy.RULE_BASED ? form.aiConfig : undefined,
    };
  }, [form, banks]);

  const handleSave = async () => {
    try {
      const payload = {
        bankId: form.bankId,
        version: form.version,
        strategy: form.strategy,
        emailKind: form.emailKind,
        emailSenderPatterns: form.senderPatterns,
        subjectPatterns: form.subjectPatterns,
        rules: {
          fields: form.fields,
          validations: form.validations,
        },
        aiConfig: form.strategy !== CreateParserConfigDto.strategy.RULE_BASED ? form.aiConfig : undefined,
        isActive: form.isActive,
      };

      if (isEditing && id) {
        await updateConfig.mutateAsync({ id, data: payload });
        toast.success('Parser config updated!');
      } else {
        await createConfig.mutateAsync(payload);
        toast.success('Parser config created!');
        navigate('/admin/parser-configs');
      }
    } catch (error) {
      toast.error('Error saving parser config');
      console.error(error);
    }
  };

  const handleTestParser = () => {
    runTest(form);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

      <Tabs defaultValue="config" className="w-full">
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
              <GeneralSettingsCard
                form={form}
                setForm={setForm}
                banks={banks}
                emailKindLabels={EMAIL_KIND_LABELS}
              />

              <FieldsSettingsCard
                form={form}
                addField={addField}
                updateField={updateField}
                removeField={removeField}
                newlyAddedFieldId={newlyAddedFieldId}
              />

              <ValidationsSettingsCard
                form={form}
                addValidation={addValidation}
                updateValidation={updateValidation}
                removeValidation={removeValidation}
              />

              <AIConfigSettingsCard
                form={form}
                setForm={setForm}
                isOpen={aiConfigOpen}
                onOpenChange={setAiConfigOpen}
              />
            </div>

            {/* JSON Preview Sidebar - Desktop */}
            <div className="hidden lg:col-span-1 lg:block">
              <JsonPreviewCard
                jsonPreview={jsonPreview}
                onCancel={() => navigate('/admin/parser-configs')}
                onSave={handleSave}
              />
            </div>
          </div>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="mt-4 sm:mt-6">
          <TestParserTab
            testHtml={testHtml}
            setTestHtml={setTestHtml}
            testLoading={testLoading}
            handleTestParser={handleTestParser}
            testResult={testResult}
            copyResultToClipboard={copyResultToClipboard}
            banks={banks}
            form={form}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
