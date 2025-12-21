import { CategoryUserReportAdminService } from '@/api/generated/services/CategoryUserReportAdminService';
import type { ApproveChangeRequestDto } from '@/api/generated/models/ApproveChangeRequestDto';
import type { RejectChangeRequestDto } from '@/api/generated/models/RejectChangeRequestDto';

export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const getReports = (params: {
  status?: ReportStatus;
  limit?: number;
  offset?: number;
}) => {
  return CategoryUserReportAdminService.categoryUserReportsAdminControllerList(
    params.status,
    params.limit,
    params.offset
  );
};

export const approveReport = (id: string, data: ApproveChangeRequestDto) => {
  return CategoryUserReportAdminService.categoryUserReportsAdminControllerApprove(id, data);
};

export const rejectReport = (id: string, data: RejectChangeRequestDto) => {
  return CategoryUserReportAdminService.categoryUserReportsAdminControllerReject(id, data);
};
