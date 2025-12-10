import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateCurrencyDialog } from './CreateCurrencyDialog';
import { EditCurrencyDialog } from './EditCurrencyDialog';
import { CurrencyDetailSheet } from './CurrencyDetailSheet';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useCurrencies,
  useDeleteCurrency,
  type Currency,
  type CurrencyStatus,
  type CurrencySource,
} from '@/stores/currenciesStore';
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
import { toast } from 'sonner';
import { TablePagination } from '@/components/ui/table-pagination';

export type { CurrencyStatus, CurrencySource, Currency };

const DEFAULT_PAGE_SIZE = 10;

export function CurrenciesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CurrencyStatus | 'all'>('all');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const deleteCurrencyMutation = useDeleteCurrency();

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Determine effective status filter
  const effectiveStatus = showOnlyPending ? 'PENDING' : statusFilter;

  // Fetch currencies from API
  // Use isFetching instead of isLoading to keep previous data visible during pagination
  const { data, isLoading, isFetching, isError } = useCurrencies({
    search: debouncedSearch,
    status: effectiveStatus,
    page,
    limit: pageSize,
  });

  const currencies = data?.data ?? [];
  const pagination = data?.pagination;
  
  // Show skeleton only on initial load, not during pagination
  const showSkeleton = isLoading && currencies.length === 0;

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: CurrencyStatus | 'all') => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleShowOnlyPendingChange = (checked: boolean) => {
    setShowOnlyPending(checked);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleViewDetails = (currency: Currency) => {
    setSelectedCurrency(currency);
    setDetailSheetOpen(true);
  };

  const handleEditCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (currency: Currency) => {
    setCurrencyToDelete(currency);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currencyToDelete) return;
    
    try {
      await deleteCurrencyMutation.mutateAsync(currencyToDelete.code);
      toast.success(`Currency ${currencyToDelete.code} deleted successfully`);
      setDeleteDialogOpen(false);
      setCurrencyToDelete(null);
    } catch (error) {
      toast.error('Failed to delete currency');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by code or name..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as CurrencyStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DEPRECATED">Deprecated</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Checkbox
              id="pending-only"
              checked={showOnlyPending}
              onCheckedChange={(checked) => handleShowOnlyPendingChange(checked as boolean)}
            />
            <label htmlFor="pending-only" className="text-sm text-muted-foreground cursor-pointer">
              Show only PENDING
            </label>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Currency
        </Button>
      </div>

      {/* Table */}
      <div className={`rounded-lg border border-border bg-card transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-32">Source</TableHead>
              <TableHead className="w-28 hidden sm:table-cell">Created</TableHead>
              <TableHead className="w-28 hidden lg:table-cell">Updated</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showSkeleton ? (
              // Loading skeleton - only on initial load
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-destructive">
                  Error loading currencies. Please try again.
                </TableCell>
              </TableRow>
            ) : currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No currencies found
                </TableCell>
              </TableRow>
            ) : (
              currencies.map((currency) => (
                <TableRow
                  key={currency.code}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(currency)}
                >
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 font-mono text-sm font-medium">
                      {currency.code}
                    </code>
                  </TableCell>
                  <TableCell className="font-medium">{currency.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={currency.status} />
                  </TableCell>
                  <TableCell>
                    <SourceBadge source={currency.source} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {format(currency.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {format(currency.updatedAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(currency)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditCurrency(currency); }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Status
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(currency); }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={handlePageSizeChange}
      />

      <CreateCurrencyDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <EditCurrencyDialog
        currency={selectedCurrency}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <CurrencyDetailSheet
        currency={selectedCurrency}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Currency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{currencyToDelete?.code}</strong> ({currencyToDelete?.name})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteCurrencyMutation.isPending}
            >
              {deleteCurrencyMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: CurrencyStatus }) {
  const variants: Record<CurrencyStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    ACTIVE: { variant: 'default', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    PENDING: { variant: 'outline', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' },
    DEPRECATED: { variant: 'secondary', className: 'bg-muted text-muted-foreground' },
  };

  return (
    <Badge variant={variants[status].variant} className={variants[status].className}>
      {status}
    </Badge>
  );
}

function SourceBadge({ source }: { source: CurrencySource }) {
  const styles: Record<CurrencySource, string> = {
    SYSTEM: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    AUTO_DETECTED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    MANUAL: 'bg-muted text-muted-foreground',
  };

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styles[source]}`}>
      {source.replace('_', ' ')}
    </span>
  );
}
