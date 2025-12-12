import { Skeleton } from '@/components/ui/skeleton';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'warning' | 'destructive';
  isLoading?: boolean;
}

const variantStyles = {
  default: 'border-border bg-card',
  warning: 'border-yellow-500/30 bg-yellow-500/5',
  destructive: 'border-destructive/30 bg-destructive/5',
};

const iconStyles = {
  default: 'text-muted-foreground',
  warning: 'text-yellow-500',
  destructive: 'text-destructive',
};

const valueStyles = {
  default: 'text-foreground',
  warning: 'text-yellow-600 dark:text-yellow-400',
  destructive: 'text-destructive',
};

export function SummaryCard({ label, value, icon: Icon, variant, isLoading }: SummaryCardProps) {
  return (
    <div className={`rounded-lg border p-3 sm:p-4 ${variantStyles[variant]}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />
        <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-1 h-7 w-12 sm:h-8" />
      ) : (
        <p className={`mt-1 text-xl font-bold sm:text-2xl ${valueStyles[variant]}`}>
          {value}
        </p>
      )}
    </div>
  );
}
