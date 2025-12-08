import { useState } from 'react';
import { Plus, Search, Edit2, Power, Loader2 } from 'lucide-react';
import { 
  useBanks, 
  useCreateBank, 
  useUpdateBank, 
  useToggleBankActive,
  useSetBanksFilters,
  useBanksFilters,
  type Bank,
} from '@/stores';
import { PageHeader } from '@/components/admin/PageHeader';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminBanks() {
  const banksQuery = useBanks();
  const setFilters = useSetBanksFilters();
  
  const banks = banksQuery.data ?? [];
  const isLoading = banksQuery.isLoading;
  const error = banksQuery.error;
  
  console.log('Banks state:', { banks, isLoading, error, status: banksQuery.status, fetchStatus: banksQuery.fetchStatus });
  
  const createBank = useCreateBank();
  const updateBank = useUpdateBank();
  const toggleActive = useToggleBankActive();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    isActive: true,
  });

  const openCreateDialog = () => {
    setEditingBank(null);
    setFormData({ name: '', slug: '', country: '', isActive: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      slug: bank.slug,
      country: bank.country,
      isActive: bank.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingBank) {
        await updateBank.mutateAsync({ id: editingBank.id, data: formData });
        toast.success('Banco actualizado');
      } else {
        await createBank.mutateAsync(formData);
        toast.success('Banco creado');
      }
      setIsDialogOpen(false);
    } catch {
      toast.error('Error al guardar banco');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleActive.mutateAsync(id);
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  if (error) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in sm:space-y-6">
      <PageHeader title="Banks" description="Manage bank integrations and configurations">
        <Button onClick={openCreateDialog} size="sm" className="gap-1.5 sm:gap-2">
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Create Bank</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            defaultValue=""
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 h-9 text-sm sm:h-10"
          />
        </div>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Email Domains</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banks.map((bank) => (
              <TableRow key={bank.id} className="group">
                <TableCell className="font-medium">{bank.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {bank.slug}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">{bank.country}</TableCell>
                <TableCell>
                  <Badge variant={bank.isActive ? 'default' : 'secondary'}>
                    {bank.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {bank.emailDomains.length > 0 ? bank.emailDomains.join(', ') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(bank)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleActive(bank.id)}
                    >
                      <Power className={`h-4 w-4 ${bank.isActive ? 'text-success' : 'text-muted-foreground'}`} />
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
        {banks.map((bank) => (
          <Card key={bank.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-medium">{bank.name}</h3>
                    <Badge variant={bank.isActive ? 'default' : 'secondary'} className="flex-shrink-0 text-[10px]">
                      {bank.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                      {bank.slug}
                    </code>
                    <span>•</span>
                    <span>{bank.country}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(bank)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleActive(bank.id)}
                  >
                    <Power className={`h-4 w-4 ${bank.isActive ? 'text-success' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingBank ? 'Edit Bank' : 'Create Bank'}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editingBank ? 'Update bank details below.' : 'Add a new bank integration.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Bank name"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="slug" className="text-xs sm:text-sm">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="bank-slug"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="country" className="text-xs sm:text-sm">Country (ISO Code)</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                placeholder="CR, US, MX..."
                maxLength={2}
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="text-xs sm:text-sm">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={createBank.isPending || updateBank.isPending}
            >
              {(createBank.isPending || updateBank.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingBank ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
