import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowRight, Check, X, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { CategoryUserReport } from '@/stores/categoryUserReportsStore';

interface ReportCardProps {
  report: CategoryUserReport;
  onApprove: (id: string, note?: string) => Promise<void>;
  onReject: (id: string, note: string) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

const statusConfig = {
  PENDING: { variant: 'warning' as const, label: 'Pending' },
  APPROVED: { variant: 'success' as const, label: 'Approved' },
  REJECTED: { variant: 'destructive' as const, label: 'Rejected' },
};

export function ReportCard({
  report,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ReportCardProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approveNote, setApproveNote] = useState('');
  const [rejectNote, setRejectNote] = useState('');

  const isPending = report.status === 'PENDING';
  const isProcessing = isApproving || isRejecting;
  const { variant, label } = statusConfig[report.status];

  const handleApprove = async () => {
    await onApprove(report.id, approveNote || undefined);
    setShowApproveDialog(false);
    setApproveNote('');
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return;
    await onReject(report.id, rejectNote);
    setShowRejectDialog(false);
    setRejectNote('');
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left side - Report info */}
            <div className="flex-1 space-y-3">
              {/* Merchant name and status */}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  {report.merchantNameSnapshot}
                </h3>
                <Badge variant={variant}>{label}</Badge>
              </div>

              {/* Category change */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                  {report.currentCategoryIdSnapshot || 'Sin categoría'}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="rounded-md bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  {report.requestedCategoryId}
                </span>
              </div>

              {/* User note */}
              {report.userNote && (
                <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">{report.userNote}</p>
                </div>
              )}

              {/* Resolution note (for resolved reports) */}
              {report.resolutionNote && (
                <div className="rounded-lg border border-border/50 bg-card p-3 text-sm">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Resolution Note</p>
                  <p className="text-foreground">{report.resolutionNote}</p>
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-muted-foreground">
                Reported {format(new Date(report.createdAt), 'MMM d, yyyy · h:mm a')}
              </p>
            </div>

            {/* Right side - Actions */}
            {isPending && (
              <div className="flex shrink-0 gap-2 sm:flex-col">
                <Button
                  size="sm"
                  onClick={() => setShowApproveDialog(true)}
                  disabled={isProcessing}
                  className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 sm:flex-none"
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                  className="flex-1 gap-1.5 sm:flex-none"
                >
                  {isRejecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Category Change</DialogTitle>
            <DialogDescription>
              This will apply the category change globally. All transactions from{' '}
              <strong>{report.merchantNameSnapshot}</strong> will be recategorized.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
              <span className="text-muted-foreground">
                {report.currentCategoryIdSnapshot || 'No category'}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-primary">{report.requestedCategoryId}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approve-note">Resolution Note (optional)</Label>
              <Textarea
                id="approve-note"
                placeholder="Add a note about this approval..."
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              {isApproving && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Category Change</DialogTitle>
            <DialogDescription>
              The user's personal category change will remain active, but it won't be applied
              globally.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-note">
                Resolution Note <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reject-note"
                placeholder="Explain why this change is being rejected..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                A note is required when rejecting a report.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectNote.trim()}
              className="gap-1.5"
            >
              {isRejecting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
