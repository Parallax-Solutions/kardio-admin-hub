import { Edit2, Power, Play } from 'lucide-react';
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
import type { ParserConfig, ParserStrategy } from '@/stores';

interface ParserConfigsTableProps {
  configs: ParserConfig[];
  isToggling: boolean;
  getBankName: (bankId: string) => string;
  onEdit: (config: ParserConfig) => void;
  onTest: (config: ParserConfig) => void;
  onToggleActive: (config: ParserConfig) => void;
}

const getStrategyBadge = (strategy: ParserStrategy) => {
  const styles: Record<ParserStrategy, string> = {
    RULE_BASED: 'bg-info/10 text-info border-info/20',
    AI: 'bg-warning/10 text-warning border-warning/20',
    HYBRID: 'bg-success/10 text-success border-success/20',
  };
  return styles[strategy] || '';
};

export function ParserConfigsTable({
  configs,
  isToggling,
  getBankName,
  onEdit,
  onTest,
  onToggleActive,
}: ParserConfigsTableProps) {
  return (
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
              <TableCell className="text-muted-foreground">
                {getBankName(config.bankId)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStrategyBadge(config.strategy)}`}
                >
                  {config.strategy}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {config.emailKind.replace(/_/g, ' ')}
              </TableCell>
              <TableCell>
                <Badge
                  variant={config.isActive ? 'default' : 'secondary'}
                  className="text-xs"
                >
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
                    onClick={() => onTest(config)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(config)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleActive(config)}
                    disabled={isToggling}
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
  );
}
