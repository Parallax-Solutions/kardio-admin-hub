import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BanksSearchBarProps {
  isLoading: boolean;
  onSearchChange: (search: string) => void;
}

export function BanksSearchBar({ isLoading, onSearchChange }: BanksSearchBarProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          defaultValue=""
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-sm sm:h-10"
        />
      </div>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
