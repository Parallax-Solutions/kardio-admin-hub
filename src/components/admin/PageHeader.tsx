import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4', className)}>
      <div className="min-w-0 space-y-0.5 sm:space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2 sm:gap-3">{children}</div>}
    </div>
  );
}
