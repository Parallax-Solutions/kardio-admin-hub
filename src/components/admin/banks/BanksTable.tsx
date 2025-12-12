import { Edit2, Power } from 'lucide-react';
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
import type { Bank } from '@/stores';

interface BanksTableProps {
  banks: Bank[];
  onEdit: (bank: Bank) => void;
  onToggleActive: (id: string) => void;
}

export function BanksTable({ banks, onEdit, onToggleActive }: BanksTableProps) {
  return (
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
                    onClick={() => onEdit(bank)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleActive(bank.id)}
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
  );
}
