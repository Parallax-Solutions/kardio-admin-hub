import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useParserConfigs,
  useActivateParserConfig,
  useDeactivateParserConfig,
  useSetParserConfigsFilters,
  useParserConfigsFilters,
  useBanks,
  type ParserConfig,
} from '@/stores';

export function useParserConfigsList() {
  const navigate = useNavigate();
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ParserConfig | null>(null);

  const { data: configs = [], isLoading, error } = useParserConfigs();
  const { data: banks = [] } = useBanks();
  const filters = useParserConfigsFilters();
  const setFilters = useSetParserConfigsFilters();

  const activateConfig = useActivateParserConfig();
  const deactivateConfig = useDeactivateParserConfig();

  const getBankName = (bankId: string) => {
    const bank = banks.find((b) => b.id === bankId);
    return bank?.name || bankId;
  };

  const openCreateDialog = () => {
    navigate('/admin/parser-configs/new');
  };

  const openEditDialog = (config: ParserConfig) => {
    navigate(`/admin/parser-configs/${config.id}/edit`);
  };

  const openTestDialog = (config: ParserConfig) => {
    setSelectedConfig(config);
    setTestDialogOpen(true);
  };

  const closeTestDialog = () => {
    setTestDialogOpen(false);
  };

  const handleToggleActive = async (config: ParserConfig) => {
    try {
      if (config.isActive) {
        await deactivateConfig.mutateAsync(config.id);
        toast.success('Configuración desactivada');
      } else {
        await activateConfig.mutateAsync(config.id);
        toast.success('Configuración activada');
      }
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const isToggling = activateConfig.isPending || deactivateConfig.isPending;

  return {
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
  };
}
