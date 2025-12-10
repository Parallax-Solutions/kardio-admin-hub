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
import { CreateCurrencyDialog } from './CreateCurrencyDialog';
import { EditCurrencyDialog } from './EditCurrencyDialog';
import { CurrencyDetailSheet } from './CurrencyDetailSheet';
import { format } from 'date-fns';

export type CurrencyStatus = 'ACTIVE' | 'PENDING' | 'DEPRECATED';
export type CurrencySource = 'SYSTEM' | 'AUTO_DETECTED' | 'MANUAL';

export interface Currency {
  code: string;
  name: string;
  status: CurrencyStatus;
  source: CurrencySource;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockCurrencies: Currency[] = [
  { code: 'USD', name: 'United States Dollar', status: 'ACTIVE', source: 'SYSTEM', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { code: 'CRC', name: 'Costa Rican Colón', status: 'ACTIVE', source: 'SYSTEM', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { code: 'MXN', name: 'Mexican Peso', status: 'ACTIVE', source: 'SYSTEM', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { code: 'EUR', name: 'Euro', status: 'ACTIVE', source: 'SYSTEM', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { code: 'COP', name: 'Colombian Peso', status: 'PENDING', source: 'AUTO_DETECTED', createdAt: new Date('2024-11-15'), updatedAt: new Date('2024-11-15') },
  { code: 'PEN', name: 'Peruvian Sol', status: 'PENDING', source: 'AUTO_DETECTED', createdAt: new Date('2024-11-20'), updatedAt: new Date('2024-11-20') },
  { code: 'GTQ', name: 'Guatemalan Quetzal', status: 'PENDING', source: 'AUTO_DETECTED', createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01') },
  { code: 'VEF', name: 'Venezuelan Bolívar', status: 'DEPRECATED', source: 'SYSTEM', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-06-01') },
];

export function CurrenciesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const filteredCurrencies = mockCurrencies.filter((currency) => {
    const matchesSearch =
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || currency.status === statusFilter;

    const matchesPending = !showOnlyPending || currency.status === 'PENDING';

    return matchesSearch && matchesStatus && matchesPending;
  });

  const handleViewDetails = (currency: Currency) => {
    setSelectedCurrency(currency);
    setDetailSheetOpen(true);
  };

  const handleEditCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setEditDialogOpen(true);
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              onCheckedChange={(checked) => setShowOnlyPending(checked as boolean)}
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
      <div className="rounded-lg border border-border bg-card">
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
            {filteredCurrencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No currencies found
                </TableCell>
              </TableRow>
            ) : (
              filteredCurrencies.map((currency) => (
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
                        <DropdownMenuItem onClick={() => handleEditCurrency(currency)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
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
