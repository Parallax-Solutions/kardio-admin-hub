import { useState } from 'react';
import { format } from 'date-fns';
import { Check, ChevronsUpDown, Plus, ArrowRight, Calendar, Hash, Eye } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CreateCurrencyDialog } from './CreateCurrencyDialog';
import type { CurrencySynonym } from './SynonymsTab';

interface MapSynonymSheetProps {
  synonym: CurrencySynonym | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock available currencies
const availableCurrencies = [
  { code: 'USD', name: 'United States Dollar', status: 'ACTIVE' as const },
  { code: 'CRC', name: 'Costa Rican Colón', status: 'ACTIVE' as const },
  { code: 'MXN', name: 'Mexican Peso', status: 'ACTIVE' as const },
  { code: 'EUR', name: 'Euro', status: 'ACTIVE' as const },
  { code: 'COP', name: 'Colombian Peso', status: 'PENDING' as const },
  { code: 'PEN', name: 'Peruvian Sol', status: 'PENDING' as const },
  { code: 'GTQ', name: 'Guatemalan Quetzal', status: 'PENDING' as const },
  { code: 'ARS', name: 'Argentine Peso', status: 'ACTIVE' as const },
  { code: 'BRL', name: 'Brazilian Real', status: 'ACTIVE' as const },
  { code: 'CLP', name: 'Chilean Peso', status: 'ACTIVE' as const },
];

export function MapSynonymSheet({
  synonym,
  open,
  onOpenChange,
}: MapSynonymSheetProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(
    synonym?.currencyCode ?? null
  );
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!synonym) return null;

  const handleMapToExisting = async () => {
    if (!selectedCurrency) {
      toast.error('Please select a currency');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success(`Synonym mapped to ${selectedCurrency} successfully`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to map synonym');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAndMap = (data: { code: string; name: string }) => {
    setSelectedCurrency(data.code);
    toast.success(`Currency ${data.code} created and synonym mapped`);
    onOpenChange(false);
  };

  const selectedCurrencyData = availableCurrencies.find(
    (c) => c.code === selectedCurrency
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Map Synonym
            </SheetTitle>
            <SheetDescription>
              Map this synonym to an existing currency or create a new one.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Synonym Info Card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Raw Label</label>
                  <p className="font-medium">{synonym.rawLabel}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Normalized Label</label>
                  <code className="block text-sm text-muted-foreground font-mono">
                    {synonym.normalizedLabel}
                  </code>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Hash className="h-3.5 w-3.5" />
                    <span>{synonym.occurrences.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    <span>First: {format(synonym.firstSeenAt, 'MMM d')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Last: {format(synonym.lastSeenAt, 'MMM d')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Currency</label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                  >
                    {selectedCurrencyData ? (
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                          {selectedCurrencyData.code}
                        </code>
                        <span>{selectedCurrencyData.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Search currencies...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search by code or name..." />
                    <CommandList>
                      <CommandEmpty>No currency found.</CommandEmpty>
                      <CommandGroup>
                        {availableCurrencies.map((currency) => (
                          <CommandItem
                            key={currency.code}
                            value={`${currency.code} ${currency.name}`}
                            onSelect={() => {
                              setSelectedCurrency(currency.code);
                              setComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedCurrency === currency.code
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <code className="mr-2 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                              {currency.code}
                            </code>
                            <span className="flex-1">{currency.name}</span>
                            <CurrencyStatusBadge status={currency.status} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Divider with "or" */}
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            {/* Create New Currency Button */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create New Currency from this Synonym
            </Button>
          </div>

          <SheetFooter className="mt-8 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMapToExisting}
              disabled={!selectedCurrency || isSubmitting}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              {isSubmitting ? 'Mapping...' : 'Map to Currency'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <CreateCurrencyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultValues={{
          name: synonym.rawLabel,
          status: 'ACTIVE',
        }}
        onSuccess={handleCreateAndMap}
      />
    </>
  );
}

function CurrencyStatusBadge({ status }: { status: 'ACTIVE' | 'PENDING' }) {
  if (status === 'ACTIVE') {
    return (
      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
        ACTIVE
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
      PENDING
    </Badge>
  );
}
