import { CheckCircle2, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        All caught up!
      </h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        No duplicate merchants to review. The queue is empty.
      </p>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Run a scan to detect new duplicates</span>
      </div>
    </div>
  );
}
