import { toast } from 'sonner';
import { useBanks, useToggleBankActive, useSetBanksFilters } from '@/stores';
import { useBankForm } from './useBankForm';

export function useBanksList() {
  const banksQuery = useBanks();
  const setFilters = useSetBanksFilters();
  const toggleActive = useToggleBankActive();

  const banks = banksQuery.data ?? [];
  const isLoading = banksQuery.isLoading;
  const error = banksQuery.error;

  const bankForm = useBankForm();

  const handleToggleActive = async (id: string) => {
    try {
      await toggleActive.mutateAsync(id);
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const handleSearchChange = (search: string) => {
    setFilters({ search });
  };

  return {
    // Data
    banks,
    isLoading,
    error,
    // Actions
    handleToggleActive,
    handleSearchChange,
    // Form hook (spread all form properties)
    ...bankForm,
  };
}
