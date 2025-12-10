import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Currency } from './CurrenciesTab';

const editCurrencySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  status: z.enum(['ACTIVE', 'PENDING', 'DEPRECATED']),
});

type EditCurrencyFormData = z.infer<typeof editCurrencySchema>;

interface EditCurrencyDialogProps {
  currency: Currency | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: EditCurrencyFormData & { code: string }) => void;
}

export function EditCurrencyDialog({
  currency,
  open,
  onOpenChange,
  onSuccess,
}: EditCurrencyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditCurrencyFormData>({
    resolver: zodResolver(editCurrencySchema),
    defaultValues: {
      name: '',
      status: 'ACTIVE',
    },
  });

  // Reset form when currency changes
  useEffect(() => {
    if (currency) {
      form.reset({
        name: currency.name,
        status: currency.status,
      });
    }
  }, [currency, form]);

  const handleSubmit = async (data: EditCurrencyFormData) => {
    if (!currency) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success(`Currency ${currency.code} updated successfully`);
      onSuccess?.({ ...data, code: currency.code });
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update currency');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Update the currency name or change its status.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="United States Dollar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
