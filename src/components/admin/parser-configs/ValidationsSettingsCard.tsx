import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Plus } from 'lucide-react';
import { ValidationRow, type Validation } from '@/components/admin/ValidationRow';
import type { ParserConfigFormState } from '@/hooks/useParserConfigEditor';

interface ValidationsSettingsCardProps {
  form: ParserConfigFormState;
  addValidation: () => void;
  updateValidation: (index: number, validation: Validation) => void;
  removeValidation: (index: number) => void;
}

export function ValidationsSettingsCard({
  form,
  addValidation,
  updateValidation,
  removeValidation,
}: ValidationsSettingsCardProps) {
  return (
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
  );
}
