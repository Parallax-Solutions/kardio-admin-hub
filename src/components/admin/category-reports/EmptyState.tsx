import { CheckCircle2, Inbox } from 'lucide-react';

interface EmptyStateProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function EmptyState({ status }: EmptyStateProps) {
  if (status === 'PENDING') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">All caught up!</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          There are no pending category change reports. Check back later or review the history of
          processed reports.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">No reports found</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        There are no {status.toLowerCase()} reports to display.
      </p>
    </div>
  );
}
