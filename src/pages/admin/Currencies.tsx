import { useState } from 'react';
import { Coins, ArrowLeftRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CurrenciesTab } from '@/components/admin/currencies/CurrenciesTab';
import { SynonymsTab } from '@/components/admin/currencies/SynonymsTab';
import { SummaryCard } from '@/components/admin/currencies/SummaryCard';
import { useCurrenciesStats, useSynonymsStats } from '@/stores/currenciesStore';

export default function Currencies() {
  const [activeTab, setActiveTab] = useState('currencies');

  // Fetch stats from dedicated endpoints
  const { data: currenciesStats, isLoading: currenciesLoading } = useCurrenciesStats();
  const { data: synonymsStats, isLoading: synonymsLoading } = useSynonymsStats();

  // Extract stats
  const pendingCurrencies = currenciesStats?.byStatus?.PENDING ?? 0;
  const totalCurrencies = currenciesStats?.total ?? 0;
  const unmappedSynonyms = synonymsStats?.byStatus?.UNMAPPED ?? 0;
  const totalSynonyms = synonymsStats?.total ?? 0;

  const isLoading = currenciesLoading || synonymsLoading;

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
          value={pendingCurrencies}
          icon={AlertCircle}
          variant="warning"
          isLoading={isLoading}
        />
        <SummaryCard
          label="Unmapped Synonyms"
          value={unmappedSynonyms}
          icon={ArrowLeftRight}
          variant="destructive"
          isLoading={isLoading}
        />
        <SummaryCard
          label="Total Currencies"
          value={totalCurrencies}
          icon={Coins}
          variant="default"
          isLoading={isLoading}
        />
        <SummaryCard
          label="Total Synonyms"
          value={totalSynonyms}
          icon={CheckCircle2}
          variant="default"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none sm:inline-flex">
          <TabsTrigger value="currencies" className="gap-2">
            <Coins className="h-4 w-4" />
            Currencies
            {pendingCurrencies > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {pendingCurrencies}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="synonyms" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Synonyms
            {unmappedSynonyms > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {unmappedSynonyms}
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
