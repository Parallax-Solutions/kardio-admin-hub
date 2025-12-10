import { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapSynonymSheet } from './MapSynonymSheet';
import { BulkMapDialog } from './BulkMapDialog';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useSynonyms,
  type CurrencySynonym,
  type SynonymStatus,
  type SynonymCreatedBy,
} from '@/stores/currenciesStore';
import { TablePagination } from '@/components/ui/table-pagination';

export type { SynonymStatus, SynonymCreatedBy, CurrencySynonym };

const DEFAULT_PAGE_SIZE = 10;

export function SynonymsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SynonymStatus | 'all'>('all');
  const [showOnlyUnmapped, setShowOnlyUnmapped] = useState(true);
  const [selectedSynonyms, setSelectedSynonyms] = useState<string[]>([]);
  const [mapSheetOpen, setMapSheetOpen] = useState(false);
  const [synonymToMap, setSynonymToMap] = useState<CurrencySynonym | null>(null);
  const [bulkMapDialogOpen, setBulkMapDialogOpen] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Determine effective status filter
  const effectiveStatus = showOnlyUnmapped ? 'UNMAPPED' : statusFilter;

  // Fetch synonyms from API
  // Use isFetching instead of isLoading to keep previous data visible during pagination
  const { data, isLoading, isFetching, isError } = useSynonyms({
    search: debouncedSearch,
    status: effectiveStatus,
    page,
    limit: pageSize,
  });

  const synonyms = data?.data ?? [];
  const pagination = data?.pagination;
  
  // Show skeleton only on initial load, not during pagination
  const showSkeleton = isLoading && synonyms.length === 0;

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: SynonymStatus | 'all') => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleShowOnlyUnmappedChange = (checked: boolean) => {
    setShowOnlyUnmapped(checked);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Get unique currencies from the fetched synonyms for the filter dropdown
  const uniqueCurrencies = useMemo(() => 
    [...new Set(synonyms.map((s) => s.currencyCode).filter(Boolean))] as string[],
    [synonyms]
  );

  const handleMapClick = (synonym: CurrencySynonym) => {
    setSynonymToMap(synonym);
    setMapSheetOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSynonyms(synonyms.filter((s) => s.status === 'UNMAPPED').map((s) => s.id));
    } else {
      setSelectedSynonyms([]);
    }
  };

  const handleSelectSynonym = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSynonyms([...selectedSynonyms, id]);
    } else {
      setSelectedSynonyms(selectedSynonyms.filter((s) => s !== id));
    }
  };

  const unmappedCount = synonyms.filter((s) => s.status === 'UNMAPPED').length;
  const allUnmappedSelected = unmappedCount > 0 && selectedSynonyms.length === unmappedCount;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by label..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as SynonymStatus | 'all')}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="UNMAPPED">Unmapped</SelectItem>
                <SelectItem value="MAPPED">Mapped</SelectItem>
              </SelectContent>
            </Select>
{/* Currency filter removed - API handles filtering */}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="unmapped-only"
              checked={showOnlyUnmapped}
              onCheckedChange={(checked) => handleShowOnlyUnmappedChange(checked as boolean)}
            />
            <label htmlFor="unmapped-only" className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap">
              Show only UNMAPPED
            </label>
          </div>
          {selectedSynonyms.length > 0 && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2"
              onClick={() => setBulkMapDialogOpen(true)}
            >
              <ArrowRight className="h-4 w-4" />
              Bulk Map ({selectedSynonyms.length})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg border border-border bg-card overflow-x-auto transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 sticky left-0 bg-card">
                <Checkbox
                  checked={allUnmappedSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all unmapped"
                />
              </TableHead>
              <TableHead className="min-w-[180px]">Raw Label</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[80px]">Currency</TableHead>
              <TableHead className="min-w-[120px] hidden sm:table-cell">Occurrences</TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">Last Seen</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showSkeleton ? (
              // Loading skeleton - only on initial load
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="sticky left-0 bg-card"><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-14" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-destructive">
                  Error loading synonyms. Please try again.
                </TableCell>
              </TableRow>
            ) : synonyms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No synonyms found
                </TableCell>
              </TableRow>
            ) : (
              synonyms.map((synonym) => (
                <TableRow key={synonym.id}>
                  <TableCell className="sticky left-0 bg-card">
                    {synonym.status === 'UNMAPPED' && (
                      <Checkbox
                        checked={selectedSynonyms.includes(synonym.id)}
                        onCheckedChange={(checked) => handleSelectSynonym(synonym.id, checked as boolean)}
                        aria-label={`Select ${synonym.rawLabel}`}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium truncate max-w-[200px]" title={synonym.rawLabel}>
                      {synonym.rawLabel}
                    </div>
                    <code className="text-xs text-muted-foreground font-mono md:hidden">
                      {synonym.normalizedLabel}
                    </code>
                  </TableCell>
                  <TableCell>
                    <SynonymStatusBadge status={synonym.status} />
                  </TableCell>
                  <TableCell>
                    {synonym.currencyCode ? (
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium">
                        {synonym.currencyCode}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <OccurrencesIndicator count={synonym.occurrences} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {format(synonym.lastSeenAt, 'MMM d')}
                  </TableCell>
                  <TableCell>
                    {synonym.status === 'UNMAPPED' ? (
                      <Button
                        size="sm"
                        onClick={() => handleMapClick(synonym)}
                        className="gap-1"
                      >
                        Map
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMapClick(synonym)}
                      >
                        Edit
                      </Button>
                    )}
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

      <MapSynonymSheet
        synonym={synonymToMap}
        open={mapSheetOpen}
        onOpenChange={setMapSheetOpen}
        onSuccess={() => setSelectedSynonyms([])}
      />

      <BulkMapDialog
        synonymIds={selectedSynonyms}
        synonyms={synonyms}
        open={bulkMapDialogOpen}
        onOpenChange={setBulkMapDialogOpen}
        onSuccess={() => setSelectedSynonyms([])}
      />
    </div>
  );
}

function SynonymStatusBadge({ status }: { status: SynonymStatus }) {
  if (status === 'MAPPED') {
    return (
      <Badge variant="outline" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
        <CheckCircle2 className="h-3 w-3" />
        MAPPED
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 bg-destructive/10 text-destructive border-destructive/30">
      <AlertCircle className="h-3 w-3" />
      UNMAPPED
    </Badge>
  );
}

function OccurrencesIndicator({ count }: { count: number }) {
  const maxWidth = 100;
  const maxCount = 2500;
  const width = Math.min((count / maxCount) * maxWidth, maxWidth);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium tabular-nums">{count.toLocaleString()}</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary/60"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
