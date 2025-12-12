import { useState } from 'react';
import { useUpdateUserRole, type User, type UserRole } from '@/stores';
import { toast } from 'sonner';

interface ConfirmDialogState {
  open: boolean;
  user: User | null;
  newRole: UserRole | null;
}

export function useUserRoleChange() {
  const updateRole = useUpdateUserRole();

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    user: null,
    newRole: null,
  });

  const handleRoleChange = (user: User, newRole: UserRole) => {
    if (newRole !== user.role) {
      setConfirmDialog({ open: true, user, newRole });
    }
  };

  const confirmRoleChange = async () => {
    if (confirmDialog.user && confirmDialog.newRole) {
      try {
        await updateRole.mutateAsync({
          id: confirmDialog.user.id,
          role: confirmDialog.newRole,
        });
        toast.success('Rol actualizado');
      } catch {
        toast.error('Error al actualizar rol');
      }
    }
    closeDialog();
  };

  const closeDialog = () => {
    setConfirmDialog({ open: false, user: null, newRole: null });
  };

  return {
    confirmDialog,
    handleRoleChange,
    confirmRoleChange,
    closeDialog,
  };
}
