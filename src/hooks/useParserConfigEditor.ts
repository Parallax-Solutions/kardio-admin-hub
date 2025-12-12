import { useEffect, useState } from 'react';
import { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';
import type { ParserConfig } from '@/stores/parserConfigsStore';
import type { ParserField, Extractor, TransformOptions } from '@/components/admin/FieldCard';
import type { Validation } from '@/components/admin/ValidationRow';

interface AIConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface ParserConfigFormState {
  bankId: string;
  version: string;
  strategy: CreateParserConfigDto.strategy;
  emailKind: CreateParserConfigDto['emailKind'];
  isActive: boolean;
  senderPatterns: string[];
  subjectPatterns: string[];
  fields: ParserField[];
  validations: Validation[];
  aiConfig: AIConfig;
}

export function useParserConfigEditor(params: {
  isEditing: boolean;
  existingConfig: ParserConfig | null | undefined;
}) {
  const { isEditing, existingConfig } = params;

  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [newlyAddedFieldId, setNewlyAddedFieldId] = useState<string | null>(null);
  const [loadedSampleEmailHtml, setLoadedSampleEmailHtml] = useState<string | null>(null);

  const [form, setForm] = useState<ParserConfigFormState>({
    bankId: '',
    version: 'v1.0',
    strategy: CreateParserConfigDto.strategy.RULE_BASED,
    emailKind: CreateParserConfigDto.emailKind.TRANSACTION_NOTIFICATION,
    isActive: true,
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

  useEffect(() => {
    if (existingConfig && isEditing) {
      const backendFields = (
        existingConfig.rules as {
          fields?: Array<{
            fieldName?: string;
            name?: string;
            required?: boolean;
            defaultValue?: string;
            transform?: TransformOptions;
            extractors?: Extractor[];
          }>;
        }
      )?.fields || [];

      const mappedFields: ParserField[] = backendFields.map((f) => ({
        id: crypto.randomUUID(),
        fieldName: (f.fieldName || f.name || '') as ParserField['fieldName'],
        required: f.required || false,
        defaultValue: f.defaultValue,
        transform: f.transform,
        extractors: (f.extractors || []).map((e) => ({
          ...e,
          id: e.id || crypto.randomUUID(),
        })),
      }));

      setForm({
        bankId: existingConfig.bankId,
        version: existingConfig.version,
        strategy: existingConfig.strategy,
        emailKind: existingConfig.emailKind,
        isActive: existingConfig.isActive,
        senderPatterns: existingConfig.emailSenderPatterns || [],
        subjectPatterns: existingConfig.subjectPatterns || [],
        fields: mappedFields,
        validations: (
          (existingConfig.rules as {
            validations?: Array<{
              field?: string;
              rule?: string;
              value?: any;
              errorMessage?: string;
            }>;
          })?.validations || []
        ).map((v) => ({
          id: crypto.randomUUID(),
          field: (v.field || '') as Validation['field'],
          rule: (v.rule || 'REQUIRED') as Validation['rule'],
          value: v.value,
          errorMessage: v.errorMessage,
        })),
        aiConfig: {
          model: (existingConfig.aiConfig as unknown as AIConfig)?.model || 'gpt-4o-mini',
          systemPrompt: (existingConfig.aiConfig as unknown as AIConfig)?.systemPrompt || '',
          temperature: (existingConfig.aiConfig as unknown as AIConfig)?.temperature || 0.7,
          maxTokens: (existingConfig.aiConfig as unknown as AIConfig)?.maxTokens || 1000,
        },
      });

      setLoadedSampleEmailHtml(existingConfig.sampleEmailHtml || null);
    }
  }, [existingConfig, isEditing]);

  const addField = () => {
    const newId = crypto.randomUUID();
    const newField: ParserField = {
      id: newId,
      fieldName: '',
      required: false,
      defaultValue: undefined,
      transform: undefined,
      extractors: [],
    };
    setNewlyAddedFieldId(newId);
    setForm((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const updateField = (index: number, field: ParserField) => {
    setForm((prev) => {
      const updated = [...prev.fields];
      updated[index] = field;
      return { ...prev, fields: updated };
    });
  };

  const removeField = (index: number) => {
    setForm((prev) => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }));
  };

  const addValidation = () => {
    const newValidation: Validation = {
      id: crypto.randomUUID(),
      field: '',
      rule: 'REQUIRED',
    };
    setForm((prev) => ({ ...prev, validations: [...prev.validations, newValidation] }));
  };

  const updateValidation = (index: number, validation: Validation) => {
    setForm((prev) => {
      const updated = [...prev.validations];
      updated[index] = validation;
      return { ...prev, validations: updated };
    });
  };

  const removeValidation = (index: number) => {
    setForm((prev) => ({ ...prev, validations: prev.validations.filter((_, i) => i !== index) }));
  };

  return {
    form,
    setForm,
    aiConfigOpen,
    setAiConfigOpen,
    newlyAddedFieldId,
    setNewlyAddedFieldId,
    loadedSampleEmailHtml,
    addField,
    updateField,
    removeField,
    addValidation,
    updateValidation,
    removeValidation,
  };
}
