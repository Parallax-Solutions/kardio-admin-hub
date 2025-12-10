import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Power, Loader2, Play } from 'lucide-react';
import { 
  useParserConfigs,
  useActivateParserConfig,
  useDeactivateParserConfig,
  useSetParserConfigsFilters,
  useParserConfigsFilters,
  useBanks,
  type ParserConfig,
  type ParserStrategy,
} from '@/stores';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { TestParserDialog } from '@/components/admin/parser-configs/TestParserDialog';

export default function AdminParserConfigs() {
  const navigate = useNavigate();
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ParserConfig | null>(null);
  const { data: configs = [], isLoading, error } = useParserConfigs();
  const { data: banks = [] } = useBanks();
  const filters = useParserConfigsFilters();
  const setFilters = useSetParserConfigsFilters();
  
  const activateConfig = useActivateParserConfig();
  const deactivateConfig = useDeactivateParserConfig();

  // Obtener nombre del banco por ID
  const getBankName = (bankId: string) => {
    const bank = banks.find((b) => b.id === bankId);
    return bank?.name || bankId;
  };

  const openCreateDialog = () => {
    navigate('/admin/parser-configs/new');
  };

  const openEditDialog = (config: ParserConfig) => {
    navigate(`/admin/parser-configs/${config.id}/edit`);
  };

  const openTestDialog = (config: ParserConfig) => {
    setSelectedConfig(config);
    setTestDialogOpen(true);
  };

  const handleToggleActive = async (config: ParserConfig) => {
    try {
      if (config.isActive) {
        await deactivateConfig.mutateAsync(config.id);
        toast.success('Configuración desactivada');
      } else {
        await activateConfig.mutateAsync(config.id);
        toast.success('Configuración activada');
      }
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const getStrategyBadge = (strategy: ParserStrategy) => {
    const styles: Record<ParserStrategy, string> = {
      RULE_BASED: 'bg-info/10 text-info border-info/20',
      AI: 'bg-warning/10 text-warning border-warning/20',
      HYBRID: 'bg-success/10 text-success border-success/20',
    };
    return styles[strategy] || '';
  };

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Parser Configs" description="Manage email and document parsers">
        <Button onClick={openCreateDialog} size="sm" className="gap-1.5 sm:gap-2">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Create Config</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Select 
          value={filters.bankId ?? 'all'} 
          onValueChange={(value) => setFilters({ bankId: value === 'all' ? null : value })}
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
          onValueChange={(value) => setFilters({ 
            active: value === 'all' ? null : value === 'active' 
          })}
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

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead>Email Kind</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id} className="group">
                <TableCell className="font-medium">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    v{config.version}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">{getBankName(config.bankId)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${getStrategyBadge(config.strategy)}`}>
                    {config.strategy}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {config.emailKind.replace(/_/g, ' ')}
                </TableCell>
                <TableCell>
                  <Badge variant={config.isActive ? 'default' : 'secondary'} className="text-xs">
                    {config.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Test Parser"
                      onClick={() => openTestDialog(config)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(config)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleActive(config)}
                      disabled={activateConfig.isPending || deactivateConfig.isPending}
                    >
                      <Power
                        className={`h-4 w-4 ${
                          config.isActive ? 'text-success' : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {configs.map((config) => (
          <Card key={config.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      v{config.version}
                    </code>
                    <Badge variant={config.isActive ? 'default' : 'secondary'} className="text-[10px]">
                      {config.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{getBankName(config.bankId)}</span>
                    <Badge variant="outline" className={`text-[10px] ${getStrategyBadge(config.strategy)}`}>
                      {config.strategy}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Test Parser"
                    onClick={() => openTestDialog(config)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(config)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(config)}
                    disabled={activateConfig.isPending || deactivateConfig.isPending}
                  >
                    <Power
                      className={`h-4 w-4 ${
                        config.isActive ? 'text-success' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TestParserDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        config={selectedConfig}
        bankName={selectedConfig ? getBankName(selectedConfig.bankId) : ''}
      />
    </div>
  );
}
