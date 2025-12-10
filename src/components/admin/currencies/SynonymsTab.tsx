import { useState } from 'react';
import { Search, Filter, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { format } from 'date-fns';

export type SynonymStatus = 'UNMAPPED' | 'MAPPED';
export type SynonymCreatedBy = 'SYSTEM' | 'ADMIN' | 'AUTO_DETECT';

export interface CurrencySynonym {
  id: string;
  rawLabel: string;
  normalizedLabel: string;
  status: SynonymStatus;
  currencyCode: string | null;
  occurrences: number;
  firstSeenAt: Date;
  lastSeenAt: Date;
  createdBy: SynonymCreatedBy;
}

// Mock data
const mockSynonyms: CurrencySynonym[] = [
  { id: '1', rawLabel: 'US Dollar', normalizedLabel: 'US DOLLAR', status: 'MAPPED', currencyCode: 'USD', occurrences: 1250, firstSeenAt: new Date('2024-01-15'), lastSeenAt: new Date('2024-12-08'), createdBy: 'SYSTEM' },
  { id: '2', rawLabel: 'Dólares Americanos', normalizedLabel: 'DOLARES AMERICANOS', status: 'MAPPED', currencyCode: 'USD', occurrences: 890, firstSeenAt: new Date('2024-02-01'), lastSeenAt: new Date('2024-12-07'), createdBy: 'SYSTEM' },
  { id: '3', rawLabel: 'PESO COLOMBIANO', normalizedLabel: 'PESO COLOMBIANO', status: 'UNMAPPED', currencyCode: null, occurrences: 156, firstSeenAt: new Date('2024-11-15'), lastSeenAt: new Date('2024-12-09'), createdBy: 'AUTO_DETECT' },
  { id: '4', rawLabel: 'Mexican Peso', normalizedLabel: 'MEXICAN PESO', status: 'UNMAPPED', currencyCode: null, occurrences: 89, firstSeenAt: new Date('2024-11-20'), lastSeenAt: new Date('2024-12-08'), createdBy: 'AUTO_DETECT' },
  { id: '5', rawLabel: 'Colones', normalizedLabel: 'COLONES', status: 'MAPPED', currencyCode: 'CRC', occurrences: 2340, firstSeenAt: new Date('2024-01-01'), lastSeenAt: new Date('2024-12-09'), createdBy: 'SYSTEM' },
  { id: '6', rawLabel: 'CRC Colones', normalizedLabel: 'CRC COLONES', status: 'MAPPED', currencyCode: 'CRC', occurrences: 567, firstSeenAt: new Date('2024-03-10'), lastSeenAt: new Date('2024-12-05'), createdBy: 'ADMIN' },
  { id: '7', rawLabel: 'SOLES PERUANOS', normalizedLabel: 'SOLES PERUANOS', status: 'UNMAPPED', currencyCode: null, occurrences: 45, firstSeenAt: new Date('2024-11-25'), lastSeenAt: new Date('2024-12-06'), createdBy: 'AUTO_DETECT' },
  { id: '8', rawLabel: 'Quetzal', normalizedLabel: 'QUETZAL', status: 'UNMAPPED', currencyCode: null, occurrences: 23, firstSeenAt: new Date('2024-12-01'), lastSeenAt: new Date('2024-12-08'), createdBy: 'AUTO_DETECT' },
  { id: '9', rawLabel: 'Euro €', normalizedLabel: 'EURO', status: 'MAPPED', currencyCode: 'EUR', occurrences: 234, firstSeenAt: new Date('2024-04-15'), lastSeenAt: new Date('2024-12-04'), createdBy: 'SYSTEM' },
  { id: '10', rawLabel: 'Euros', normalizedLabel: 'EUROS', status: 'MAPPED', currencyCode: 'EUR', occurrences: 189, firstSeenAt: new Date('2024-05-01'), lastSeenAt: new Date('2024-12-03'), createdBy: 'ADMIN' },
  { id: '11', rawLabel: 'Peso Argentino', normalizedLabel: 'PESO ARGENTINO', status: 'UNMAPPED', currencyCode: null, occurrences: 12, firstSeenAt: new Date('2024-12-05'), lastSeenAt: new Date('2024-12-09'), createdBy: 'AUTO_DETECT' },
  { id: '12', rawLabel: 'Real Brasileño', normalizedLabel: 'REAL BRASILENO', status: 'UNMAPPED', currencyCode: null, occurrences: 8, firstSeenAt: new Date('2024-12-07'), lastSeenAt: new Date('2024-12-09'), createdBy: 'AUTO_DETECT' },
];

export function SynonymsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [showOnlyUnmapped, setShowOnlyUnmapped] = useState(true);
  const [selectedSynonyms, setSelectedSynonyms] = useState<string[]>([]);
  const [mapSheetOpen, setMapSheetOpen] = useState(false);
  const [synonymToMap, setSynonymToMap] = useState<CurrencySynonym | null>(null);

  const filteredSynonyms = mockSynonyms.filter((synonym) => {
    const matchesSearch =
      synonym.rawLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      synonym.normalizedLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || synonym.status === statusFilter;

    const matchesCurrency =
      currencyFilter === 'all' || synonym.currencyCode === currencyFilter;

    const matchesUnmapped = !showOnlyUnmapped || synonym.status === 'UNMAPPED';

    return matchesSearch && matchesStatus && matchesCurrency && matchesUnmapped;
  });

  const uniqueCurrencies = [...new Set(mockSynonyms.map((s) => s.currencyCode).filter(Boolean))];

  const handleMapClick = (synonym: CurrencySynonym) => {
    setSynonymToMap(synonym);
    setMapSheetOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSynonyms(filteredSynonyms.filter((s) => s.status === 'UNMAPPED').map((s) => s.id));
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

  const unmappedCount = filteredSynonyms.filter((s) => s.status === 'UNMAPPED').length;
  const allUnmappedSelected = unmappedCount > 0 && selectedSynonyms.length === unmappedCount;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="UNMAPPED">Unmapped</SelectItem>
              <SelectItem value="MAPPED">Mapped</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              {uniqueCurrencies.map((code) => (
                <SelectItem key={code} value={code!}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Checkbox
              id="unmapped-only"
              checked={showOnlyUnmapped}
              onCheckedChange={(checked) => setShowOnlyUnmapped(checked as boolean)}
            />
            <label htmlFor="unmapped-only" className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap">
              Show only UNMAPPED
            </label>
          </div>
        </div>
        {selectedSynonyms.length > 0 && (
          <Button variant="secondary" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Bulk Map ({selectedSynonyms.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={allUnmappedSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all unmapped"
                />
              </TableHead>
              <TableHead>Raw Label</TableHead>
              <TableHead className="hidden md:table-cell">Normalized</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-24">Currency</TableHead>
              <TableHead className="w-28 hidden sm:table-cell">Occurrences</TableHead>
              <TableHead className="w-28 hidden lg:table-cell">Last Seen</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSynonyms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No synonyms found
                </TableCell>
              </TableRow>
            ) : (
              filteredSynonyms.map((synonym) => (
                <TableRow key={synonym.id}>
                  <TableCell>
                    {synonym.status === 'UNMAPPED' && (
                      <Checkbox
                        checked={selectedSynonyms.includes(synonym.id)}
                        onCheckedChange={(checked) => handleSelectSynonym(synonym.id, checked as boolean)}
                        aria-label={`Select ${synonym.rawLabel}`}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{synonym.rawLabel}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <code className="text-xs text-muted-foreground font-mono">
                      {synonym.normalizedLabel}
                    </code>
                  </TableCell>
                  <TableCell>
                    <SynonymStatusBadge status={synonym.status} />
                  </TableCell>
                  <TableCell>
                    {synonym.currencyCode ? (
                      <code className="rounded bg-muted px-2 py-1 font-mono text-sm font-medium">
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
                    {format(synonym.lastSeenAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {synonym.status === 'UNMAPPED' ? (
                      <Button
                        size="sm"
                        onClick={() => handleMapClick(synonym)}
                        className="gap-1.5"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
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

      <MapSynonymSheet
        synonym={synonymToMap}
        open={mapSheetOpen}
        onOpenChange={setMapSheetOpen}
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
