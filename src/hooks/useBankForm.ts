import { useState } from 'react';
import { useCreateBank, useUpdateBank, type Bank } from '@/stores';
import { toast } from 'sonner';

export interface BankFormData {
  name: string;
  slug: string;
  country: string;
  isActive: boolean;
}

const initialFormData: BankFormData = {
  name: '',
  slug: '',
  country: '',
  isActive: true,
};

export function useBankForm() {
  const createBank = useCreateBank();
  const updateBank = useUpdateBank();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState<BankFormData>(initialFormData);

  const openCreateDialog = () => {
    setEditingBank(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      slug: bank.slug,
      country: bank.country,
      isActive: bank.isActive,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingBank) {
        await updateBank.mutateAsync({ id: editingBank.id, data: formData });
        toast.success('Banco actualizado');
      } else {
        await createBank.mutateAsync(formData);
        toast.success('Banco creado');
      }
      setIsDialogOpen(false);
    } catch {
      toast.error('Error al guardar banco');
    }
  };

  const updateFormField = <K extends keyof BankFormData>(field: K, value: BankFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isDialogOpen,
    editingBank,
    formData,
    isPending: createBank.isPending || updateBank.isPending,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    updateFormField,
    setFormData,
  };
}
