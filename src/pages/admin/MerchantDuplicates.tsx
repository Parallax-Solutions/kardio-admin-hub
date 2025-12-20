import { useState } from 'react';
import { RefreshCw, GitMerge, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/admin/PageHeader';
import { DuplicateCard, EmptyState } from '@/components/admin/merchant-duplicates';
import {
  useDuplicateSuggestions,
  usePendingCount,
  useAcceptSuggestion,
  useRejectSuggestion,
  useRunSimilarityJob,
} from '@/stores/merchantDuplicatesStore';
import { toast } from 'sonner';

export default function MerchantDuplicates() {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Queries
  const { data: suggestions, isLoading, error, refetch } = useDuplicateSuggestions('PENDING');
  const { data: pendingCount } = usePendingCount();
  
  // Mutations
  const acceptMutation = useAcceptSuggestion();
  const rejectMutation = useRejectSuggestion();
  const runJobMutation = useRunSimilarityJob();
  
  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      const result = await acceptMutation.mutateAsync(id);
      const mergeResult = result?.mergeResult;
      toast.success(
        `Merchants merged! ${mergeResult?.transactionsUpdated ?? 0} transactions updated.`,
        { duration: 3000 }
      );
    } catch {
      toast.error('Failed to merge merchants');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectMutation.mutateAsync(id);
      toast.success('Suggestion dismissed');
    } catch {
      toast.error('Failed to dismiss suggestion');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRunScan = async () => {
    try {
      const result = await runJobMutation.mutateAsync();
      toast.success(
        `Scan complete! Found ${result?.suggestionsCreated ?? 0} new duplicates.`,
        { duration: 4000 }
      );
    } catch {
      toast.error('Failed to run similarity scan');
    }
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Merchant Duplicates"
        description="Review and merge similar merchant entries to keep your data clean."
      >
        <div className="flex items-center gap-2">
          {pendingCount !== undefined && pendingCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pendingCount} pending
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleRunScan}
            disabled={runJobMutation.isPending}
            className="gap-1.5"
          >
            {runJobMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GitMerge className="h-4 w-4" />
            )}
            Run Scan
          </Button>
        </div>
      </PageHeader>
      
      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>Failed to load suggestions. Please try again.</p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && suggestions?.length === 0 && <EmptyState />}
      
      {/* Suggestions list */}
      {!isLoading && !error && suggestions && suggestions.length > 0 && (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <DuplicateCard
              key={suggestion.id}
              suggestion={suggestion}
              onAccept={handleAccept}
              onReject={handleReject}
              isAccepting={processingId === suggestion.id && acceptMutation.isPending}
              isRejecting={processingId === suggestion.id && rejectMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
