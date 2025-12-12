import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Plus } from 'lucide-react';
import { FieldCard, type ParserField } from '@/components/admin/FieldCard';
import type { ParserConfigFormState } from '@/hooks/useParserConfigEditor';

interface FieldsSettingsCardProps {
  form: ParserConfigFormState;
  addField: () => void;
  updateField: (index: number, field: ParserField) => void;
  removeField: (index: number) => void;
  newlyAddedFieldId: string | null;
}

export function FieldsSettingsCard({
  form,
  addField,
  updateField,
  removeField,
  newlyAddedFieldId,
}: FieldsSettingsCardProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <CardTitle className="text-sm sm:text-lg">Fields & Extractors</CardTitle>
          </div>
          <Button onClick={addField} size="sm" className="gap-1 h-8 text-xs sm:gap-1.5 sm:h-9 sm:text-sm">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Field</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Define which fields to extract and how
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        {form.fields.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center sm:rounded-xl sm:p-8">
            <Code2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50 sm:mb-3 sm:h-10 sm:w-10" />
            <h4 className="mb-1 text-sm font-medium">No fields defined</h4>
            <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
              Add fields to start extracting data
            </p>
            <Button onClick={addField} variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add Your First Field
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {form.fields.map((field, index) => (
              <FieldCard
                key={field.id}
                field={field}
                index={index}
                onChange={(updated) => updateField(index, updated)}
                onRemove={() => removeField(index)}
                defaultOpen={field.id === newlyAddedFieldId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
