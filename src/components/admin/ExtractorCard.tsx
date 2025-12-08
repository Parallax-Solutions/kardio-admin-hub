import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Extractor {
  id: string;
  type: 'REGEX' | 'XPATH' | 'CSS_SELECTOR' | 'JSON_PATH';
  pattern: string;
  flags?: string;
  captureGroup?: number;
}

interface ExtractorCardProps {
  extractor: Extractor;
  index: number;
  onChange: (extractor: Extractor) => void;
  onRemove: () => void;
}

export function ExtractorCard({ extractor, index, onChange, onRemove }: ExtractorCardProps) {
  return (
    <div className="group relative flex gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:border-border">
      <div className="flex cursor-grab items-center text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Extractor #{index + 1}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select
              value={extractor.type}
              onValueChange={(value: Extractor['type']) =>
                onChange({ ...extractor, type: value })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGEX">Regex</SelectItem>
                <SelectItem value="XPATH">XPath</SelectItem>
                <SelectItem value="CSS_SELECTOR">CSS Selector</SelectItem>
                <SelectItem value="JSON_PATH">JSON Path</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Flags</Label>
              <Input
                value={extractor.flags || ''}
                onChange={(e) => onChange({ ...extractor, flags: e.target.value })}
                placeholder="i, g, m"
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Capture Group</Label>
              <Input
                type="number"
                min={0}
                value={extractor.captureGroup ?? ''}
                onChange={(e) =>
                  onChange({
                    ...extractor,
                    captureGroup: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="0"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Pattern</Label>
          <Textarea
            value={extractor.pattern}
            onChange={(e) => onChange({ ...extractor, pattern: e.target.value })}
            placeholder={
              extractor.type === 'REGEX'
                ? 'e.g. Amount:\\s*\\$?([\\d,.]+)'
                : extractor.type === 'XPATH'
                ? 'e.g. //div[@class="amount"]/text()'
                : extractor.type === 'CSS_SELECTOR'
                ? 'e.g. .transaction-amount'
                : 'e.g. $.transaction.amount'
            }
            className="min-h-[60px] font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
