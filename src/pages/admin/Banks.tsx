import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { useBanksList } from '@/hooks/useBanksList';
import { BankFormDialog, BanksTable, BankCard, BanksSearchBar } from '@/components/admin/banks';

export default function AdminBanks() {
  const {
    banks,
    isLoading,
    error,
    handleToggleActive,
    handleSearchChange,
    isDialogOpen,
    editingBank,
    formData,
    isPending,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    updateFormField,
  } = useBanksList();

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Banks" description="Manage bank integrations and configurations">
        <Button onClick={openCreateDialog} size="sm" className="gap-1.5 sm:gap-2">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Create Bank</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </PageHeader>

      <BanksSearchBar isLoading={isLoading} onSearchChange={handleSearchChange} />

      <BanksTable
        banks={banks}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <div className="grid gap-3 md:hidden">
        {banks.map((bank) => (
          <BankCard
            key={bank.id}
            bank={bank}
            onEdit={openEditDialog}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>

      <BankFormDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
        editingBank={editingBank}
        formData={formData}
        onFormChange={updateFormField}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
}
