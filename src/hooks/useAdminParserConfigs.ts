import { useState, useMemo } from 'react';
import { mockParserConfigs, mockBanks, ParserConfig, Bank } from '@/data/mockData';

export function useAdminParserConfigs() {
  const [configs, setConfigs] = useState<ParserConfig[]>(mockParserConfigs);
  const [banks] = useState<Bank[]>(mockBanks);
  const [bankFilter, setBankFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading] = useState(false);

  const filteredConfigs = useMemo(() => {
    return configs.filter((config) => {
      const bankMatch = bankFilter === 'all' || config.bankId === bankFilter;
      const statusMatch = statusFilter === 'all' || config.status === statusFilter;
      return bankMatch && statusMatch;
    });
  }, [configs, bankFilter, statusFilter]);

  const createConfig = (config: Omit<ParserConfig, 'id' | 'createdAt'>) => {
    const newConfig: ParserConfig = {
      ...config,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setConfigs((prev) => [newConfig, ...prev]);
  };

  const updateConfig = (id: string, updates: Partial<ParserConfig>) => {
    setConfigs((prev) =>
      prev.map((config) => (config.id === id ? { ...config, ...updates } : config))
    );
  };

  const toggleConfigStatus = (id: string) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === id
          ? { ...config, status: config.status === 'enabled' ? 'disabled' : 'enabled' }
          : config
      )
    );
  };

  return {
    configs: filteredConfigs,
    banks,
    bankFilter,
    setBankFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    createConfig,
    updateConfig,
    toggleConfigStatus,
  };
}
