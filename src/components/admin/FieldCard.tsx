import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ExtractorCard, Extractor } from './ExtractorCard';
export type { Extractor };
import { cn } from '@/lib/utils';

// Transform types
export type TransformName =
  | 'trim'
  | 'uppercase'
  | 'lowercase'
  | 'parseAmount'
  | 'parseDate'
  | 'parseLocation'
  | 'extractClientName';

export type ClientNameTokenKind = 'given1' | 'given2' | 'surname1' | 'surname2';

interface TransformOptionsBase {
  locale?: string;
}

export interface TrimTransformOptions extends TransformOptionsBase {
  type: 'trim';
}

export interface UppercaseTransformOptions extends TransformOptionsBase {
  type: 'uppercase';
}

export interface LowercaseTransformOptions extends TransformOptionsBase {
  type: 'lowercase';
}

export interface ParseAmountTransformOptions extends TransformOptionsBase {
  type: 'parseAmount';
}

export interface ParseDateTransformOptions extends TransformOptionsBase {
  type: 'parseDate';
  dateFormat?: string;
}

export interface ParseLocationTransformOptions extends TransformOptionsBase {
  type: 'parseLocation';
}

export interface ExtractClientNameTransformOptions extends TransformOptionsBase {
  type: 'extractClientName';
  layout: ClientNameTokenKind[];
  optionalTokens?: ClientNameTokenKind[];
}

export type TransformOptions =
  | TrimTransformOptions
  | UppercaseTransformOptions
  | LowercaseTransformOptions
  | ParseAmountTransformOptions
  | ParseDateTransformOptions
  | ParseLocationTransformOptions
  | ExtractClientNameTransformOptions;

export const FIELD_OPTIONS = [
  'merchant',
  'amount',
  'currency',
  'date',
  'location',
  'city',
  'country',
  'cardBrand',
  'cardLast4',
  'transactionType',
  'transactionDirection',
  'authorizationCode',
  'reference',
  'clientName',
] as const;

export type FieldName = typeof FIELD_OPTIONS[number];

export interface ParserField {
  id: string;
  fieldName: FieldName | '';
  required: boolean;
  defaultValue?: string;
  transform?: TransformOptions;
  extractors: Extractor[];
}

interface FieldCardProps {
  field: ParserField;
  index: number;
  onChange: (field: ParserField) => void;
  onRemove: () => void;
  defaultOpen?: boolean;
}

export function FieldCard({ field, index, onChange, onRemove, defaultOpen = false }: FieldCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const addExtractor = () => {
    const newExtractor: Extractor = {
      id: crypto.randomUUID(),
      type: 'REGEX',
      pattern: '',
      flags: '',
    };
    onChange({ ...field, extractors: [...field.extractors, newExtractor] });
  };

  const updateExtractor = (extractorIndex: number, extractor: Extractor) => {
    const updated = [...field.extractors];
    updated[extractorIndex] = extractor;
    onChange({ ...field, extractors: updated });
  };

  const removeExtractor = (extractorIndex: number) => {
    onChange({
      ...field,
      extractors: field.extractors.filter((_, i) => i !== extractorIndex),
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border bg-card shadow-card transition-shadow hover:shadow-elevated sm:rounded-xl">
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
              )}
              <div>
                <h4 className="text-sm font-medium sm:text-base">
                  {field.fieldName || `Field #${index + 1}`}
                </h4>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  {field.extractors.length} extractor{field.extractors.length !== 1 ? 's' : ''}
                  {field.required && ' • Required'}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive sm:h-8 sm:w-8"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Field Name</Label>
                <Select
                  value={field.fieldName}
                  onValueChange={(value: FieldName) =>
                    onChange({ ...field, fieldName: value })
                  }
                >
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Default Value</Label>
                <Input
                  value={field.defaultValue || ''}
                  onChange={(e) =>
                    onChange({ ...field, defaultValue: e.target.value || undefined })
                  }
                  placeholder="Optional"
                  className="h-9 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Transform</Label>
                <Select
                  value={field.transform?.type || 'none'}
                  onValueChange={(value: TransformName | 'none') => {
                    if (value === 'none') {
                      onChange({ ...field, transform: undefined });
                    } else if (value === 'extractClientName') {
                      onChange({
                        ...field,
                        transform: {
                          type: 'extractClientName',
                          layout: ['given1', 'surname1'],
                        },
                      });
                    } else if (value === 'parseDate') {
                      onChange({
                        ...field,
                        transform: { type: 'parseDate' },
                      });
                    } else {
                      onChange({
                        ...field,
                        transform: { type: value } as TransformOptions,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="trim">trim</SelectItem>
                    <SelectItem value="uppercase">uppercase</SelectItem>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                    <SelectItem value="parseAmount">parseAmount</SelectItem>
                    <SelectItem value="parseDate">parseDate</SelectItem>
                    <SelectItem value="parseLocation">parseLocation</SelectItem>
                    <SelectItem value="extractClientName">extractClientName</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pb-1 sm:pb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      onChange({ ...field, required: checked === true })
                    }
                  />
                  <Label htmlFor={`required-${field.id}`} className="cursor-pointer text-xs sm:text-sm">
                    Required
                  </Label>
                </div>
              </div>
            </div>

            {/* Transform Options - only show for transforms that have options */}
            {field.transform && ['parseAmount', 'parseDate', 'extractClientName'].includes(field.transform.type) && (
              <div className="mt-3 rounded-md border border-border/50 bg-muted/20 p-3 sm:mt-4 sm:p-4">
                <h5 className="mb-2 text-xs font-medium text-muted-foreground sm:mb-3 sm:text-sm">
                  Transform Options
                </h5>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Locale - available for parseAmount, parseDate, extractClientName */}
                  <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">Locale</Label>
                      <Input
                        value={field.transform.locale || ''}
                        onChange={(e) =>
                          onChange({
                            ...field,
                            transform: { ...field.transform!, locale: e.target.value || undefined },
                          })
                        }
                        placeholder="e.g. es-CR"
                        className="h-9 text-xs sm:text-sm"
                      />
                  </div>

                  {/* Date Format - only for parseDate */}
                  {field.transform.type === 'parseDate' && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">Date Format</Label>
                      <Input
                        value={(field.transform as ParseDateTransformOptions).dateFormat || ''}
                        onChange={(e) =>
                          onChange({
                            ...field,
                            transform: {
                              ...field.transform!,
                              dateFormat: e.target.value || undefined,
                            } as ParseDateTransformOptions,
                          })
                        }
                        placeholder="e.g. dd/MM/yyyy HH:mm"
                        className="h-9 text-xs sm:text-sm"
                      />
                    </div>
                  )}

                  {/* Layout - only for extractClientName */}
                  {field.transform.type === 'extractClientName' && (
                    <>
                      <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-3">
                        <Label className="text-xs sm:text-sm">Layout (token order)</Label>
                        <div className="flex flex-wrap gap-2">
                          {(['given1', 'given2', 'surname1', 'surname2'] as ClientNameTokenKind[]).map((token) => {
                            const layout = (field.transform as ExtractClientNameTransformOptions).layout || [];
                            const isSelected = layout.includes(token);
                            const position = layout.indexOf(token);
                            return (
                              <Button
                                key={token}
                                type="button"
                                variant={isSelected ? 'default' : 'outline'}
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                  const currentLayout = [...layout];
                                  if (isSelected) {
                                    currentLayout.splice(position, 1);
                                  } else {
                                    currentLayout.push(token);
                                  }
                                  onChange({
                                    ...field,
                                    transform: {
                                      ...field.transform!,
                                      layout: currentLayout,
                                    } as ExtractClientNameTransformOptions,
                                  });
                                }}
                              >
                                {isSelected && <span className="mr-1 text-[10px]">{position + 1}.</span>}
                                {token}
                              </Button>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Click to add/remove. Order matters.
                        </p>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-3">
                        <Label className="text-xs sm:text-sm">Optional Tokens</Label>
                        <div className="flex flex-wrap gap-2">
                          {(['given1', 'given2', 'surname1', 'surname2'] as ClientNameTokenKind[]).map((token) => {
                            const optionalTokens = (field.transform as ExtractClientNameTransformOptions).optionalTokens || [];
                            const isOptional = optionalTokens.includes(token);
                            return (
                              <Button
                                key={token}
                                type="button"
                                variant={isOptional ? 'secondary' : 'outline'}
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                  const currentOptional = [...optionalTokens];
                                  if (isOptional) {
                                    currentOptional.splice(currentOptional.indexOf(token), 1);
                                  } else {
                                    currentOptional.push(token);
                                  }
                                  onChange({
                                    ...field,
                                    transform: {
                                      ...field.transform!,
                                      optionalTokens: currentOptional.length > 0 ? currentOptional : undefined,
                                    } as ExtractClientNameTransformOptions,
                                  });
                                }}
                              >
                                {token}
                              </Button>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Mark tokens as optional if they may not be present.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Extractors */}
            <div className="mt-4 sm:mt-6">
              <div className="mb-2 flex items-center justify-between sm:mb-3">
                <h5 className="text-xs font-medium text-muted-foreground sm:text-sm">
                  Extractors (Fallback Order)
                </h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExtractor}
                  className="gap-1 h-7 text-[10px] sm:gap-1.5 sm:h-8 sm:text-xs"
                >
                  <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">Add Extractor</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>

              {field.extractors.length === 0 ? (
                <div className="rounded-md border border-dashed bg-muted/30 p-4 text-center sm:rounded-lg sm:p-6">
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    No extractors defined. Add one to start extracting this field.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {field.extractors.map((extractor, extractorIndex) => (
                    <ExtractorCard
                      key={extractor.id}
                      extractor={extractor}
                      index={extractorIndex}
                      onChange={(updated) => updateExtractor(extractorIndex, updated)}
                      onRemove={() => removeExtractor(extractorIndex)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
