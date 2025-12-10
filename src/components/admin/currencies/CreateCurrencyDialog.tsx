import { useState } from 'react';
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
  FormDescription,
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

const createCurrencySchema = z.object({
  code: z
    .string()
    .length(3, 'Currency code must be exactly 3 characters')
    .regex(/^[A-Z]+$/, 'Currency code must be uppercase letters only'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  status: z.enum(['ACTIVE', 'PENDING', 'DEPRECATED']),
});

type CreateCurrencyFormData = z.infer<typeof createCurrencySchema>;

interface CreateCurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<CreateCurrencyFormData>;
  onSuccess?: (data: CreateCurrencyFormData) => void;
}

export function CreateCurrencyDialog({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
}: CreateCurrencyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCurrencyFormData>({
    resolver: zodResolver(createCurrencySchema),
    defaultValues: {
      code: defaultValues?.code ?? '',
      name: defaultValues?.name ?? '',
      status: defaultValues?.status ?? 'ACTIVE',
    },
  });

  const handleSubmit = async (data: CreateCurrencyFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success(`Currency ${data.code} created successfully`);
      onSuccess?.(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to create currency');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Currency</DialogTitle>
          <DialogDescription>
            Add a new currency to the catalog. The code should follow ISO 4217 format.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="USD"
                      className="font-mono uppercase"
                      maxLength={3}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    3-letter ISO 4217 code (e.g., USD, EUR, CRC)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="DEPRECATED">Deprecated</SelectItem>
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
                {isSubmitting ? 'Creating...' : 'Create Currency'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
