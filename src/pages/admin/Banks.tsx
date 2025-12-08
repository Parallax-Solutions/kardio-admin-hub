import { useState } from 'react';
import { Plus, Search, Edit2, Power } from 'lucide-react';
import { useAdminBanks } from '@/hooks/useAdminBanks';
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
import { Bank } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminBanks() {
  const { banks, searchQuery, setSearchQuery, createBank, updateBank, toggleBankActive } = useAdminBanks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    country: '',
    logoUrl: '',
    active: true,
  });

  const openCreateDialog = () => {
    setEditingBank(null);
    setFormData({ name: '', code: '', country: '', logoUrl: '', active: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      code: bank.code,
      country: bank.country,
      logoUrl: bank.logoUrl,
      active: bank.active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingBank) {
      updateBank(editingBank.id, formData);
    } else {
      createBank(formData);
    }
    setIsDialogOpen(false);
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm sm:h-10"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-xl border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banks.map((bank) => (
              <TableRow key={bank.id} className="group">
                <TableCell className="font-medium">{bank.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {bank.code}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">{bank.country}</TableCell>
                <TableCell>
                  <Badge variant={bank.active ? 'default' : 'secondary'}>
                    {bank.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">{bank.createdAt}</TableCell>
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
                      onClick={() => toggleBankActive(bank.id)}
                    >
                      <Power className={`h-4 w-4 ${bank.active ? 'text-success' : 'text-muted-foreground'}`} />
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
                    <Badge variant={bank.active ? 'default' : 'secondary'} className="flex-shrink-0 text-[10px]">
                      {bank.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                      {bank.code}
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
                    onClick={() => toggleBankActive(bank.id)}
                  >
                    <Power className={`h-4 w-4 ${bank.active ? 'text-success' : 'text-muted-foreground'}`} />
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
              <Label htmlFor="code" className="text-xs sm:text-sm">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="BANK_CODE"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="country" className="text-xs sm:text-sm">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Country"
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="logoUrl" className="text-xs sm:text-sm">Logo URL (optional)</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
                className="h-9 text-sm sm:h-10"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active" className="text-xs sm:text-sm">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              {editingBank ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
