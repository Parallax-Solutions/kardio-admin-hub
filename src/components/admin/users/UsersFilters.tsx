import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UsersFilters as FiltersType } from '@/stores/usersStore';

interface UsersFiltersProps {
  filters: FiltersType;
  isLoading: boolean;
  onRoleFilterChange: (value: string) => void;
}

export function UsersFilters({ filters, isLoading, onRoleFilterChange }: UsersFiltersProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Select
        value={filters.role ?? 'all'}
        onValueChange={onRoleFilterChange}
      >
        <SelectTrigger className="w-[120px] h-9 text-xs sm:w-[150px] sm:h-10 sm:text-sm">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="CLIENT">Client</SelectItem>
        </SelectContent>
      </Select>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
