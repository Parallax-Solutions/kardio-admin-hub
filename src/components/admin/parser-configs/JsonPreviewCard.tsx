import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface JsonPreviewCardProps {
  jsonPreview: any;
  onCancel: () => void;
  onSave: () => void;
}

export function JsonPreviewCard({ jsonPreview, onCancel, onSave }: JsonPreviewCardProps) {
  return (
    <div className="sticky top-6">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">JSON Preview</CardTitle>
          <CardDescription className="text-xs">
            Live preview of parser config
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[calc(100vh-300px)] overflow-auto rounded-lg bg-sidebar p-4 text-xs text-sidebar-foreground">
            <code>{JSON.stringify(jsonPreview, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className="flex-1 gap-1.5" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
