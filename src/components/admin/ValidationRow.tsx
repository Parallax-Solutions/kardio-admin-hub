import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FIELD_OPTIONS, FieldName } from './FieldCard';

export type ValidationRuleType = 'REQUIRED' | 'MIN' | 'MAX' | 'PATTERN' | 'ENUM';

export interface Validation {
  id: string;
  field: FieldName | '';
  ruleType: ValidationRuleType;
  value: string;
  errorMessage: string;
}

interface ValidationRowProps {
  validation: Validation;
  onChange: (validation: Validation) => void;
  onRemove: () => void;
}

export function ValidationRow({ validation, onChange, onRemove }: ValidationRowProps) {
  return (
    <>
      {/* Desktop layout */}
      <div className="group hidden grid-cols-12 gap-2 rounded-lg bg-muted/30 p-2 transition-colors hover:bg-muted/50 sm:grid">
        <div className="col-span-3">
          <Select
            value={validation.field}
            onValueChange={(value: FieldName) =>
              onChange({ ...validation, field: value })
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Field" />
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

        <div className="col-span-2">
          <Select
            value={validation.ruleType}
            onValueChange={(value: ValidationRuleType) =>
              onChange({ ...validation, ruleType: value })
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Rule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="REQUIRED">Required</SelectItem>
              <SelectItem value="MIN">Min</SelectItem>
              <SelectItem value="MAX">Max</SelectItem>
              <SelectItem value="PATTERN">Pattern</SelectItem>
              <SelectItem value="ENUM">Enum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Input
            value={validation.value}
            onChange={(e) => onChange({ ...validation, value: e.target.value })}
            placeholder="Value"
            className="h-9 text-xs"
            disabled={validation.ruleType === 'REQUIRED'}
          />
        </div>

        <div className="col-span-4">
          <Input
            value={validation.errorMessage}
            onChange={(e) => onChange({ ...validation, errorMessage: e.target.value })}
            placeholder="Error message"
            className="h-9 text-xs"
          />
        </div>

        <div className="col-span-1 flex items-center justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="group rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50 sm:hidden">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Field</Label>
              <Select
                value={validation.field}
                onValueChange={(value: FieldName) =>
                  onChange({ ...validation, field: value })
                }
              >
                <SelectTrigger className="h-8 text-[10px]">
                  <SelectValue placeholder="Field" />
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
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Rule</Label>
              <Select
                value={validation.ruleType}
                onValueChange={(value: ValidationRuleType) =>
                  onChange({ ...validation, ruleType: value })
                }
              >
                <SelectTrigger className="h-8 text-[10px]">
                  <SelectValue placeholder="Rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REQUIRED">Required</SelectItem>
                  <SelectItem value="MIN">Min</SelectItem>
                  <SelectItem value="MAX">Max</SelectItem>
                  <SelectItem value="PATTERN">Pattern</SelectItem>
                  <SelectItem value="ENUM">Enum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Value</Label>
            <Input
              value={validation.value}
              onChange={(e) => onChange({ ...validation, value: e.target.value })}
              placeholder="Value"
              className="h-8 text-[10px]"
              disabled={validation.ruleType === 'REQUIRED'}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Error</Label>
            <Input
              value={validation.errorMessage}
              onChange={(e) => onChange({ ...validation, errorMessage: e.target.value })}
              placeholder="Error message"
              className="h-8 text-[10px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
