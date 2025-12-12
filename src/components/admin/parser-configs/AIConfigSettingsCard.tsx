import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, ChevronDown } from 'lucide-react';
import type { ParserConfigFormState } from '@/hooks/useParserConfigEditor';
import { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';

interface AIConfigSettingsCardProps {
  form: ParserConfigFormState;
  setForm: React.Dispatch<React.SetStateAction<ParserConfigFormState>>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIConfigSettingsCard({ form, setForm, isOpen, onOpenChange }: AIConfigSettingsCardProps) {
  if (form.strategy !== CreateParserConfigDto.strategy.AI && form.strategy !== CreateParserConfigDto.strategy.HYBRID) {
    return null;
  }

  return (
    <Card className="shadow-card">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer p-4 pb-3 transition-colors hover:bg-muted/30 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
                <CardTitle className="text-sm sm:text-lg">AI Configuration</CardTitle>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform sm:h-5 sm:w-5 ${
                  isOpen ? 'rotate-180' : ''
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
                    setForm((prev) => ({
                      ...prev,
                      aiConfig: { ...prev.aiConfig, model: e.target.value },
                    }))
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
                    setForm((prev) => ({
                      ...prev,
                      aiConfig: {
                        ...prev.aiConfig,
                        maxTokens: parseInt(e.target.value) || 1000,
                      },
                    }))
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
                  setForm((prev) => ({
                    ...prev,
                    aiConfig: { ...prev.aiConfig, temperature: value },
                  }))
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
                  setForm((prev) => ({
                    ...prev,
                    aiConfig: { ...prev.aiConfig, systemPrompt: e.target.value },
                  }))
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
  );
}
