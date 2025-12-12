import { Edit2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Bank } from '@/stores';

interface BankCardProps {
  bank: Bank;
  onEdit: (bank: Bank) => void;
  onToggleActive: (id: string) => void;
}

export function BankCard({ bank, onEdit, onToggleActive }: BankCardProps) {
  return (
    <Card className="shadow-card">
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
        </div>
      </CardContent>
    </Card>
  );
}
