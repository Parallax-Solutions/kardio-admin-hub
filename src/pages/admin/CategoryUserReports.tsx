import { useState } from 'react';
import { RefreshCw, AlertCircle, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/admin/PageHeader';
import { ReportCard, EmptyState } from '@/components/admin/category-reports';
import {
  useCategoryUserReports,
  useApproveReport,
  useRejectReport,
  type CategoryUserReport,
} from '@/stores/categoryUserReportsStore';
import type { ReportStatus } from '@/api/services/categoryUserReportsService';
import { toast } from 'sonner';

const PAGE_SIZE = 50;

export default function CategoryUserReports() {
  const [status, setStatus] = useState<ReportStatus>('PENDING');
  const [offset, setOffset] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Queries
  const { data, isLoading, error, refetch } = useCategoryUserReports(status, PAGE_SIZE, offset);

  // Mutations
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  const reports = data?.reports ?? [];
  const total = data?.total ?? 0;
  const pendingCount = status === 'PENDING' ? total : undefined;

  const handleApprove = async (id: string, note?: string) => {
    setProcessingId(id);
    try {
      const result = await approveMutation.mutateAsync({ id, resolutionNote: note });
      const approveResult = result as { transactionsUpdated?: number };
      toast.success(
        `Category change approved! ${approveResult?.transactionsUpdated ?? 0} transactions updated.`,
        { duration: 4000 }
      );
    } catch {
      toast.error('Failed to approve report');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, note: string) => {
    setProcessingId(id);
    try {
      await rejectMutation.mutateAsync({ id, resolutionNote: note });
      toast.success('Report rejected. User\'s personal change remains active.');
    } catch {
      toast.error('Failed to reject report');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as ReportStatus);
    setOffset(0);
  };

  const handleNextPage = () => {
    if (offset + PAGE_SIZE < total) {
      setOffset(offset + PAGE_SIZE);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - PAGE_SIZE));
    }
  };

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Reports"
        description="Review user-submitted category change requests and apply them globally."
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
        </div>
      </PageHeader>

      {/* Status Tabs */}
      <Tabs value={status} onValueChange={handleStatusChange}>
        <TabsList>
          <TabsTrigger value="PENDING" className="gap-1.5">
            <FileWarning className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>Failed to load reports. Please try again.</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && reports.length === 0 && <EmptyState status={status} />}

      {/* Reports list */}
      {!isLoading && !error && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report: CategoryUserReport) => (
            <ReportCard
              key={report.id}
              report={report}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproving={processingId === report.id && approveMutation.isPending}
              isRejecting={processingId === report.id && rejectMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && total > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1}-{Math.min(offset + PAGE_SIZE, total)} of {total} reports
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={offset === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={offset + PAGE_SIZE >= total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
