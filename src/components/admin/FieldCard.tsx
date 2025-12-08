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
import { cn } from '@/lib/utils';

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
  name: FieldName | '';
  required: boolean;
  defaultValue: string;
  transform: string;
  extractors: Extractor[];
}

interface FieldCardProps {
  field: ParserField;
  index: number;
  onChange: (field: ParserField) => void;
  onRemove: () => void;
}

export function FieldCard({ field, index, onChange, onRemove }: FieldCardProps) {
  const [isOpen, setIsOpen] = useState(true);

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
      <div className="rounded-xl border bg-card shadow-card transition-shadow hover:shadow-elevated">
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <h4 className="font-medium">
                  {field.name || `Field #${index + 1}`}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {field.extractors.length} extractor{field.extractors.length !== 1 ? 's' : ''}
                  {field.required && ' • Required'}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-4 pb-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Field Name</Label>
                <Select
                  value={field.name}
                  onValueChange={(value: FieldName) =>
                    onChange({ ...field, name: value })
                  }
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Default Value</Label>
                <Input
                  value={field.defaultValue}
                  onChange={(e) =>
                    onChange({ ...field, defaultValue: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>Transform</Label>
                <Input
                  value={field.transform}
                  onChange={(e) => onChange({ ...field, transform: e.target.value })}
                  placeholder="e.g. trim, parseAmount"
                />
              </div>

              <div className="flex items-end pb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      onChange({ ...field, required: checked === true })
                    }
                  />
                  <Label htmlFor={`required-${field.id}`} className="cursor-pointer">
                    Required
                  </Label>
                </div>
              </div>
            </div>

            {/* Extractors */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h5 className="text-sm font-medium text-muted-foreground">
                  Extractors (Fallback Order)
                </h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExtractor}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Extractor
                </Button>
              </div>

              {field.extractors.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No extractors defined. Add one to start extracting this field.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
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
