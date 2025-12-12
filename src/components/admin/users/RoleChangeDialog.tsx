import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { User, UserRole } from '@/stores';

interface RoleChangeDialogProps {
  open: boolean;
  user: User | null;
  newRole: UserRole | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function RoleChangeDialog({
  open,
  user,
  newRole,
  onClose,
  onConfirm,
}: RoleChangeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">Change User Role?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm">
            You are about to change <strong>{user?.email}</strong>'s role from{' '}
            <strong>{user?.role}</strong> to <strong>{newRole}</strong>.
            {newRole === 'ADMIN' && (
              <span className="mt-2 block text-warning">
                Warning: This will grant administrative privileges to this user.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="text-xs sm:text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="text-xs sm:text-sm">
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
