import { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import { useAdminParserConfigs } from '@/hooks/useAdminParserConfigs';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
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
    setEditingConfig(null);
    setFormData({
      name: '',
      bankId: '',
      bankName: '',
      status: 'enabled',
      parserType: 'email',
      subjectPattern: '',
      fromEmail: '',
      notes: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (config: ParserConfig) => {
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
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Parser Configs" description="Manage email and document parsers">
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Config
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={bankFilter} onValueChange={setBankFilter}>
          <SelectTrigger className="w-[200px]">
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
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Bank/Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Parser Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id} className="group">
                <TableCell className="font-medium">{config.name}</TableCell>
                <TableCell className="text-muted-foreground">{config.bankName}</TableCell>
                <TableCell>
                  <Badge variant={config.status === 'enabled' ? 'default' : 'secondary'}>
                    {config.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getParserTypeBadge(config.parserType)}>
                    {config.parserType.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{config.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(config)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingConfig ? 'Edit Parser Config' : 'Create Parser Config'}</DialogTitle>
            <DialogDescription>
              {editingConfig ? 'Update parser configuration.' : 'Add a new parser configuration.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="configName">Name</Label>
              <Input
                id="configName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Parser name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Bank/Provider</Label>
              <Select value={formData.bankId} onValueChange={handleBankSelect}>
                <SelectTrigger>
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
            <div className="grid gap-2">
              <Label>Parser Type</Label>
              <Select
                value={formData.parserType}
                onValueChange={(value: 'email' | 'pdf' | 'api') =>
                  setFormData({ ...formData, parserType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subjectPattern">Subject Pattern / Regex</Label>
              <Input
                id="subjectPattern"
                value={formData.subjectPattern}
                onChange={(e) => setFormData({ ...formData, subjectPattern: e.target.value })}
                placeholder="Transaction Alert:"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                value={formData.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                placeholder="alerts@bank.com"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'enabled' | 'disabled') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingConfig ? 'Save Changes' : 'Create Config'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
