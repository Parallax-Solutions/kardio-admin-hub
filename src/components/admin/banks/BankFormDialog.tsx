import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Bank } from '@/stores';
import type { BankFormData } from '@/hooks/useBankForm';

interface BankFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingBank: Bank | null;
  formData: BankFormData;
  onFormChange: <K extends keyof BankFormData>(field: K, value: BankFormData[K]) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function BankFormDialog({
  isOpen,
  onOpenChange,
  editingBank,
  formData,
  onFormChange,
  onSubmit,
  isPending,
}: BankFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {editingBank ? 'Edit Bank' : 'Create Bank'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {editingBank ? 'Update bank details below.' : 'Add a new bank integration.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
          <div className="grid gap-1.5 sm:gap-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder="Bank name"
              className="h-9 text-sm sm:h-10"
            />
          </div>
          <div className="grid gap-1.5 sm:gap-2">
            <Label htmlFor="slug" className="text-xs sm:text-sm">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => onFormChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="bank-slug"
              className="h-9 text-sm sm:h-10"
            />
          </div>
          <div className="grid gap-1.5 sm:gap-2">
            <Label htmlFor="country" className="text-xs sm:text-sm">Country (ISO Code)</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => onFormChange('country', e.target.value.toUpperCase())}
              placeholder="CR, US, MX..."
              maxLength={2}
              className="h-9 text-sm sm:h-10"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="text-xs sm:text-sm">Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => onFormChange('isActive', checked)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingBank ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
