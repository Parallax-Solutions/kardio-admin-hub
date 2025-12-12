import { Plus, Search, Loader2 } from 'lucide-react';
import { 
  useBanks, 
  useToggleBankActive,
  useSetBanksFilters,
} from '@/stores';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useBankForm } from '@/hooks/useBankForm';
import { BankFormDialog, BanksTable, BankCard } from '@/components/admin/banks';

export default function AdminBanks() {
  const banksQuery = useBanks();
  const setFilters = useSetBanksFilters();
  const toggleActive = useToggleBankActive();
  
  const banks = banksQuery.data ?? [];
  const isLoading = banksQuery.isLoading;
  const error = banksQuery.error;

  const {
    isDialogOpen,
    editingBank,
    formData,
    isPending,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    updateFormField,
  } = useBankForm();

  const handleToggleActive = async (id: string) => {
    try {
      await toggleActive.mutateAsync(id);
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

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

      {/* Search */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            defaultValue=""
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 h-9 text-sm sm:h-10"
          />
        </div>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Desktop Table */}
      <BanksTable
        banks={banks}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      {/* Mobile Cards */}
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

      {/* Create/Edit Dialog */}
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
