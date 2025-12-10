import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUpdateCurrencyStatus, type Currency, type CurrencyStatus } from '@/stores/currenciesStore';

const editCurrencySchema = z.object({
  status: z.enum(['ACTIVE', 'PENDING', 'DEPRECATED']),
});

type EditCurrencyFormData = z.infer<typeof editCurrencySchema>;

interface EditCurrencyDialogProps {
  currency: Currency | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditCurrencyDialog({
  currency,
  open,
  onOpenChange,
  onSuccess,
}: EditCurrencyDialogProps) {
  const updateStatusMutation = useUpdateCurrencyStatus();

  const form = useForm<EditCurrencyFormData>({
    resolver: zodResolver(editCurrencySchema),
    defaultValues: {
      status: 'ACTIVE',
    },
  });

  // Reset form when currency changes
  useEffect(() => {
    if (currency) {
      form.reset({
        status: currency.status,
      });
    }
  }, [currency, form]);

  const handleSubmit = async (data: EditCurrencyFormData) => {
    if (!currency) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        code: currency.code,
        status: data.status as CurrencyStatus,
      });
      
      toast.success(`Currency ${currency.code} status updated to ${data.status}`);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update currency status');
    }
  };

  const isSubmitting = updateStatusMutation.isPending;

  if (!currency) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Currency
            <code className="rounded bg-muted px-2 py-0.5 text-sm font-mono">
              {currency.code}
            </code>
          </DialogTitle>
          <DialogDescription>
            Update the status of this currency.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Currency name is read-only - API only supports status updates */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency Name</label>
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                {currency?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Currency name cannot be changed. Only status can be updated.
              </p>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="PENDING">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="DEPRECATED">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                          Deprecated
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
