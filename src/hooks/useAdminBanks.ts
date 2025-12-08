import { useState, useMemo } from 'react';
import { mockBanks, Bank } from '@/data/mockData';

export function useAdminBanks() {
  const [banks, setBanks] = useState<Bank[]>(mockBanks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return banks;
    const query = searchQuery.toLowerCase();
    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(query) ||
        bank.code.toLowerCase().includes(query)
    );
  }, [banks, searchQuery]);

  const createBank = (bank: Omit<Bank, 'id' | 'createdAt'>) => {
    const newBank: Bank = {
      ...bank,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBanks((prev) => [newBank, ...prev]);
  };

  const updateBank = (id: string, updates: Partial<Bank>) => {
    setBanks((prev) =>
      prev.map((bank) => (bank.id === id ? { ...bank, ...updates } : bank))
    );
  };

  const toggleBankActive = (id: string) => {
    setBanks((prev) =>
      prev.map((bank) =>
        bank.id === id ? { ...bank, active: !bank.active } : bank
      )
    );
  };

  return {
    banks: filteredBanks,
    searchQuery,
    setSearchQuery,
    isLoading,
    createBank,
    updateBank,
    toggleBankActive,
  };
}
