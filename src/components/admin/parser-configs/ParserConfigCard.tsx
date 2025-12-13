import { Edit2, Power, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { ParserConfig, ParserStrategy } from '@/stores';

interface ParserConfigCardProps {
  config: ParserConfig;
  bankName: string;
  isToggling: boolean;
  onEdit: () => void;
  onTest: () => void;
  onToggleActive: () => void;
}

const getStrategyBadge = (strategy: ParserStrategy) => {
  const styles: Record<ParserStrategy, string> = {
    RULE_BASED: 'bg-info/10 text-info border-info/20',
    AI: 'bg-warning/10 text-warning border-warning/20',
    HYBRID: 'bg-success/10 text-success border-success/20',
  };
  return styles[strategy] || '';
};

export function ParserConfigCard({
  config,
  bankName,
  isToggling,
  onEdit,
  onTest,
  onToggleActive,
}: ParserConfigCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                v{config.version}
              </code>
              <Badge
                variant={config.isActive ? 'default' : 'secondary'}
                className="text-[10px]"
              >
                {config.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{bankName}</span>
              <Badge
                variant="outline"
                className={`text-[10px] ${getStrategyBadge(config.strategy)}`}
              >
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
              onClick={onTest}
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleActive}
              disabled={isToggling}
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
  );
}
