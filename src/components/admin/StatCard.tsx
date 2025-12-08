import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card p-3 shadow-card transition-all duration-300 hover:shadow-elevated sm:rounded-xl sm:p-4 lg:p-6',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
          <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-[10px] text-muted-foreground sm:text-xs">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                'text-[10px] font-medium sm:text-xs',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%{' '}
              <span className="hidden text-muted-foreground sm:inline">vs last week</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 lg:h-12 lg:w-12',
            variant === 'primary' && 'bg-primary/10 text-primary',
            variant === 'accent' && 'bg-accent/10 text-accent',
            variant === 'default' && 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </div>
      </div>
      
      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          variant === 'primary' && 'bg-gradient-to-br from-primary/5 to-transparent',
          variant === 'accent' && 'bg-gradient-to-br from-accent/5 to-transparent',
          variant === 'default' && 'bg-gradient-to-br from-muted/30 to-transparent'
        )}
      />
    </div>
  );
}
