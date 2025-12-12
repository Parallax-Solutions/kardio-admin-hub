import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagInput } from '@/components/admin/TagInput';
import { Settings2 } from 'lucide-react';
import type { ParserConfigFormState } from '@/hooks/useParserConfigEditor';
import type { Bank } from '@/stores/banksStore';
import { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';

interface GeneralSettingsCardProps {
  form: ParserConfigFormState;
  setForm: React.Dispatch<React.SetStateAction<ParserConfigFormState>>;
  banks: Bank[];
  emailKindLabels: Record<CreateParserConfigDto['emailKind'], string>;
}

export function GeneralSettingsCard({ form, setForm, banks, emailKindLabels }: GeneralSettingsCardProps) {
  return (
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
              onValueChange={(value) => setForm((prev) => ({ ...prev, bankId: value }))}
            >
              <SelectTrigger className="h-9 text-sm sm:h-10">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
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
              onChange={(e) => setForm((prev) => ({ ...prev, version: e.target.value }))}
              placeholder="e.g. v1.0"
              className="h-9 text-sm sm:h-10"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Strategy</Label>
            <Select
              value={form.strategy}
              onValueChange={(value: ParserConfigFormState['strategy']) =>
                setForm((prev) => ({ ...prev, strategy: value }))
              }
            >
              <SelectTrigger className="h-9 text-sm sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CreateParserConfigDto.strategy.RULE_BASED}>Rule Based</SelectItem>
                <SelectItem value={CreateParserConfigDto.strategy.AI}>AI</SelectItem>
                <SelectItem value={CreateParserConfigDto.strategy.HYBRID}>Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Email Kind</Label>
            <Select
              value={form.emailKind}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, emailKind: value as CreateParserConfigDto['emailKind'] }))
              }
            >
              <SelectTrigger className="h-9 text-sm sm:h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.values(CreateParserConfigDto.emailKind) as CreateParserConfigDto['emailKind'][]).map(
                  (kind) => (
                    <SelectItem key={kind} value={kind}>
                      {emailKindLabels[kind]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm">Sender Patterns (Regex)</Label>
          <TagInput
            tags={form.senderPatterns}
            onChange={(tags) => setForm((prev) => ({ ...prev, senderPatterns: tags }))}
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
            onChange={(tags) => setForm((prev) => ({ ...prev, subjectPatterns: tags }))}
            placeholder="Type pattern + Enter"
          />
          <p className="text-[10px] text-muted-foreground sm:text-xs">
            Regex patterns to match the email subject line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
