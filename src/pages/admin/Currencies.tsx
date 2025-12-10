import { useState } from 'react';
import { Coins, ArrowLeftRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CurrenciesTab } from '@/components/admin/currencies/CurrenciesTab';
import { SynonymsTab } from '@/components/admin/currencies/SynonymsTab';

// Mock data for summary stats
const summaryStats = {
  pendingCurrencies: 3,
  unmappedSynonyms: 12,
  totalCurrencies: 45,
  totalSynonyms: 128,
};

export default function Currencies() {
  const [activeTab, setActiveTab] = useState('currencies');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Currencies & Synonyms"
        description="Manage currency catalog and map bank synonyms to standardized currency codes."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <SummaryCard
          label="Pending Currencies"
          value={summaryStats.pendingCurrencies}
          icon={AlertCircle}
          variant="warning"
        />
        <SummaryCard
          label="Unmapped Synonyms"
          value={summaryStats.unmappedSynonyms}
          icon={ArrowLeftRight}
          variant="destructive"
        />
        <SummaryCard
          label="Total Currencies"
          value={summaryStats.totalCurrencies}
          icon={Coins}
          variant="default"
        />
        <SummaryCard
          label="Total Synonyms"
          value={summaryStats.totalSynonyms}
          icon={CheckCircle2}
          variant="default"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none sm:inline-flex">
          <TabsTrigger value="currencies" className="gap-2">
            <Coins className="h-4 w-4" />
            Currencies
            {summaryStats.pendingCurrencies > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {summaryStats.pendingCurrencies}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="synonyms" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Synonyms
            {summaryStats.unmappedSynonyms > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {summaryStats.unmappedSynonyms}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="currencies" className="mt-4">
          <CurrenciesTab />
        </TabsContent>

        <TabsContent value="synonyms" className="mt-4">
          <SynonymsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'warning' | 'destructive';
}

function SummaryCard({ label, value, icon: Icon, variant }: SummaryCardProps) {
  const variantStyles = {
    default: 'border-border bg-card',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    destructive: 'border-destructive/30 bg-destructive/5',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    warning: 'text-yellow-500',
    destructive: 'text-destructive',
  };

  const valueStyles = {
    default: 'text-foreground',
    warning: 'text-yellow-600 dark:text-yellow-400',
    destructive: 'text-destructive',
  };

  return (
    <div className={`rounded-lg border p-3 sm:p-4 ${variantStyles[variant]}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />
        <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
      </div>
      <p className={`mt-1 text-xl font-bold sm:text-2xl ${valueStyles[variant]}`}>
        {value}
      </p>
    </div>
  );
}
