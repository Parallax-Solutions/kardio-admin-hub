import { useState } from 'react';
import { Check, ChevronsUpDown, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useCurrencies, useBulkMapSynonyms, type CurrencySynonym } from '@/stores/currenciesStore';

interface BulkMapDialogProps {
  synonymIds: string[];
  synonyms: CurrencySynonym[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BulkMapDialog({
  synonymIds,
  synonyms,
  open,
  onOpenChange,
  onSuccess,
}: BulkMapDialogProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // Fetch currencies from API
  const { data: currenciesData, isLoading: currenciesLoading } = useCurrencies({
    status: 'all',
    page: 1,
    limit: 100,
  });

  const currencies = currenciesData?.data ?? [];

  // Bulk map mutation
  const bulkMapMutation = useBulkMapSynonyms();

  // Get selected synonyms details
  const selectedSynonyms = synonyms.filter((s) => synonymIds.includes(s.id));

  const handleBulkMap = async () => {
    if (!selectedCurrency) {
      toast.error('Please select a currency');
      return;
    }

    try {
      const mappings = synonymIds.map((synonymId) => ({
        synonymId,
        currencyCode: selectedCurrency,
      }));

      const result = await bulkMapMutation.mutateAsync(mappings) as { data?: { successful?: number; failed?: number } };
      
      const successful = result?.data?.successful ?? 0;
      const failed = result?.data?.failed ?? 0;
      
      if (failed === 0) {
        toast.success(`Successfully mapped ${successful} synonyms to ${selectedCurrency}`);
      } else {
        toast.warning(`Mapped ${successful} synonyms, ${failed} failed`);
      }
      
      onSuccess?.();
      onOpenChange(false);
      setSelectedCurrency(null);
    } catch (error) {
      toast.error('Failed to bulk map synonyms');
    }
  };

  const selectedCurrencyData = currencies.find((c) => c.code === selectedCurrency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Bulk Map Synonyms
          </DialogTitle>
          <DialogDescription>
            Map {synonymIds.length} selected synonyms to a single currency.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected synonyms preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm font-medium mb-2">Selected Synonyms:</p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedSynonyms.slice(0, 10).map((synonym) => (
                <Badge key={synonym.id} variant="secondary" className="text-xs">
                  {synonym.rawLabel}
                </Badge>
              ))}
              {selectedSynonyms.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedSynonyms.length - 10} more
                </Badge>
              )}
            </div>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
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
                    {currenciesLoading ? (
                      <div className="p-4 space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-full" />
                        ))}
                      </div>
                    ) : (
                      <CommandGroup>
                        {currencies
                          .filter((c) => c.status === 'ACTIVE')
                          .map((currency) => (
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
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkMap}
            disabled={!selectedCurrency || bulkMapMutation.isPending}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            {bulkMapMutation.isPending ? 'Mapping...' : `Map ${synonymIds.length} Synonyms`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
