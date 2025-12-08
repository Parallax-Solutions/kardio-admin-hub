import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Power } from 'lucide-react';
import { useAdminParserConfigs } from '@/hooks/useAdminParserConfigs';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ParserConfig } from '@/data/mockData';

export default function AdminParserConfigs() {
  const navigate = useNavigate();
  const {
    configs,
    banks,
    bankFilter,
    setBankFilter,
    statusFilter,
    setStatusFilter,
    createConfig,
    updateConfig,
    toggleConfigStatus,
  } = useAdminParserConfigs();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ParserConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bankId: '',
    bankName: '',
    status: 'enabled' as 'enabled' | 'disabled',
    parserType: 'email' as 'email' | 'pdf' | 'api',
    subjectPattern: '',
    fromEmail: '',
    notes: '',
  });

  const openCreateDialog = () => {
    navigate('/admin/parser-configs/new');
  };

  const openEditDialog = (config: ParserConfig) => {
    navigate(`/admin/parser-configs/${config.id}/edit`);
  };

  const openQuickEditDialog = (config: ParserConfig) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      bankId: config.bankId,
      bankName: config.bankName,
      status: config.status,
      parserType: config.parserType,
      subjectPattern: config.subjectPattern,
      fromEmail: config.fromEmail,
      notes: config.notes,
    });
    setIsDialogOpen(true);
  };

  const handleBankSelect = (bankId: string) => {
    const bank = banks.find((b) => b.id === bankId);
    setFormData({
      ...formData,
      bankId,
      bankName: bank?.name || '',
    });
  };

  const handleSubmit = () => {
    if (editingConfig) {
      updateConfig(editingConfig.id, formData);
    } else {
      createConfig(formData);
    }
    setIsDialogOpen(false);
  };

  const getParserTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      email: 'bg-info/10 text-info border-info/20',
      pdf: 'bg-warning/10 text-warning border-warning/20',
      api: 'bg-success/10 text-success border-success/20',
    };
    return styles[type] || '';
  };

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
        <Select value={bankFilter} onValueChange={setBankFilter}>
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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[110px] h-9 text-xs sm:w-[150px] sm:h-10 sm:text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Bank/Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Parser Type</TableHead>
              <TableHead className="hidden lg:table-cell">Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id} className="group">
                <TableCell className="max-w-[180px] truncate font-medium">{config.name}</TableCell>
                <TableCell className="text-muted-foreground">{config.bankName}</TableCell>
                <TableCell>
                  <Badge variant={config.status === 'enabled' ? 'default' : 'secondary'} className="text-xs">
                    {config.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${getParserTypeBadge(config.parserType)}`}>
                    {config.parserType.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{config.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                      onClick={() => toggleConfigStatus(config.id)}
                    >
                      <Power
                        className={`h-4 w-4 ${
                          config.status === 'enabled' ? 'text-success' : 'text-muted-foreground'
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
                    <h3 className="truncate text-sm font-medium">{config.name}</h3>
                    <Badge variant={config.status === 'enabled' ? 'default' : 'secondary'} className="text-[10px]">
                      {config.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{config.bankName}</span>
                    <Badge variant="outline" className={`text-[10px] ${getParserTypeBadge(config.parserType)}`}>
                      {config.parserType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
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
                    onClick={() => toggleConfigStatus(config.id)}
                  >
                    <Power
                      className={`h-4 w-4 ${
                        config.status === 'enabled' ? 'text-success' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingConfig ? 'Edit Parser Config' : 'Create Parser Config'}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editingConfig ? 'Update parser configuration.' : 'Add a new parser configuration.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="configName" className="text-xs sm:text-sm">Name</Label>
              <Input
                id="configName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Parser name"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-xs sm:text-sm">Bank/Provider</Label>
              <Select value={formData.bankId} onValueChange={handleBankSelect}>
                <SelectTrigger className="h-9 text-sm sm:h-10">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-xs sm:text-sm">Parser Type</Label>
              <Select
                value={formData.parserType}
                onValueChange={(value: 'email' | 'pdf' | 'api') =>
                  setFormData({ ...formData, parserType: value })
                }
              >
                <SelectTrigger className="h-9 text-sm sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="subjectPattern" className="text-xs sm:text-sm">Subject Pattern / Regex</Label>
              <Input
                id="subjectPattern"
                value={formData.subjectPattern}
                onChange={(e) => setFormData({ ...formData, subjectPattern: e.target.value })}
                placeholder="Transaction Alert:"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="fromEmail" className="text-xs sm:text-sm">From Email</Label>
              <Input
                id="fromEmail"
                value={formData.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                placeholder="alerts@bank.com"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-xs sm:text-sm">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'enabled' | 'disabled') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="h-9 text-sm sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="notes" className="text-xs sm:text-sm">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              {editingConfig ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
