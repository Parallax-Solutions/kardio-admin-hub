import { format } from 'date-fns';
import { Coins, Calendar, RefreshCw, Tag, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Currency, CurrencyStatus, CurrencySource } from './CurrenciesTab';

interface CurrencyDetailSheetProps {
  currency: Currency | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock associated synonyms
const mockAssociatedSynonyms = [
  { id: '1', rawLabel: 'US Dollar', occurrences: 1250 },
  { id: '2', rawLabel: 'Dólares Americanos', occurrences: 890 },
  { id: '3', rawLabel: 'USD Dollars', occurrences: 234 },
  { id: '4', rawLabel: 'American Dollar', occurrences: 156 },
];

export function CurrencyDetailSheet({
  currency,
  open,
  onOpenChange,
}: CurrencyDetailSheetProps) {
  if (!currency) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-1 font-mono text-lg">
                  {currency.code}
                </code>
                <StatusBadge status={currency.status} />
              </SheetTitle>
              <SheetDescription>{currency.name}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={Tag}
                label="Source"
                value={<SourceBadge source={currency.source} />}
              />
              <DetailItem
                icon={Calendar}
                label="Created"
                value={format(currency.createdAt, 'MMM d, yyyy')}
              />
              <DetailItem
                icon={RefreshCw}
                label="Last Updated"
                value={format(currency.updatedAt, 'MMM d, yyyy')}
              />
            </div>

            <Separator />

            {/* Associated Synonyms */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">
                Associated Synonyms
              </h4>
              <div className="space-y-2">
                {mockAssociatedSynonyms.map((synonym) => (
                  <div
                    key={synonym.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{synonym.rawLabel}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {synonym.occurrences.toLocaleString()} occurrences
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                These synonyms are mapped to this currency and will be automatically recognized.
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: CurrencyStatus }) {
  const variants: Record<CurrencyStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    ACTIVE: { variant: 'default', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    PENDING: { variant: 'outline', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' },
    DEPRECATED: { variant: 'secondary', className: 'bg-muted text-muted-foreground' },
  };

  return (
    <Badge variant={variants[status].variant} className={variants[status].className}>
      {status}
    </Badge>
  );
}

function SourceBadge({ source }: { source: CurrencySource }) {
  const styles: Record<CurrencySource, string> = {
    SYSTEM: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    AUTO_DETECTED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    MANUAL: 'bg-muted text-muted-foreground',
  };

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styles[source]}`}>
      {source.replace('_', ' ')}
    </span>
  );
}
