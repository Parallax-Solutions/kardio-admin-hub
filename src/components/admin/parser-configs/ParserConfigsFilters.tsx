import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Bank } from '@/stores';
import type { ParserConfigsFilters as FiltersType } from '@/stores/parserConfigsStore';

interface ParserConfigsFiltersProps {
  filters: FiltersType;
  banks: Bank[];
  isLoading: boolean;
  onFilterChange: (filters: Partial<FiltersType>) => void;
}

export function ParserConfigsFilters({
  filters,
  banks,
  isLoading,
  onFilterChange,
}: ParserConfigsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
      <Select
        value={filters.bankId ?? 'all'}
        onValueChange={(value) => onFilterChange({ bankId: value === 'all' ? null : value })}
      >
        <SelectTrigger className="w-[140px] h-9 text-xs sm:w-[200px] sm:h-10 sm:text-sm">
          <SelectValue placeholder="Filter by bank" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Banks</SelectItem>
          {banks.map((bank) => (
            <SelectItem key={bank.id} value={bank.id}>
              {bank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.active === null ? 'all' : filters.active ? 'active' : 'inactive'}
        onValueChange={(value) =>
          onFilterChange({
            active: value === 'all' ? null : value === 'active',
          })
        }
      >
        <SelectTrigger className="w-[110px] h-9 text-xs sm:w-[150px] sm:h-10 sm:text-sm">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
