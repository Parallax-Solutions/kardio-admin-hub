import { Plus } from 'lucide-react';
import { useParserConfigsList } from '@/hooks/useParserConfigsList';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import {
  ParserConfigsFilters,
  ParserConfigsTable,
  ParserConfigCard,
  TestParserDialog,
} from '@/components/admin/parser-configs';

export default function AdminParserConfigs() {
  const {
    configs,
    banks,
    filters,
    setFilters,
    isLoading,
    error,
    testDialogOpen,
    selectedConfig,
    isToggling,
    getBankName,
    openCreateDialog,
    openEditDialog,
    openTestDialog,
    closeTestDialog,
    handleToggleActive,
  } = useParserConfigsList();

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Parser Configs" description="Manage email and document parsers">
        <Button onClick={openCreateDialog} size="sm" className="gap-1.5 sm:gap-2">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Create Config</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </PageHeader>

      <ParserConfigsFilters
        filters={filters}
        banks={banks}
        isLoading={isLoading}
        onFilterChange={setFilters}
      />

      <ParserConfigsTable
        configs={configs}
        isToggling={isToggling}
        getBankName={getBankName}
        onEdit={openEditDialog}
        onTest={openTestDialog}
        onToggleActive={handleToggleActive}
      />

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {configs.map((config) => (
          <ParserConfigCard
            key={config.id}
            config={config}
            bankName={getBankName(config.bankId)}
            isToggling={isToggling}
            onEdit={() => openEditDialog(config)}
            onTest={() => openTestDialog(config)}
            onToggleActive={() => handleToggleActive(config)}
          />
        ))}
      </div>

      <TestParserDialog
        open={testDialogOpen}
        onOpenChange={closeTestDialog}
        config={selectedConfig}
        bankName={selectedConfig ? getBankName(selectedConfig.bankId) : ''}
      />
    </div>
  );
}
