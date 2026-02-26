import { CategoryUserReportAdminService } from '@/api/generated/services/CategoryUserReportAdminService';
import type { ApproveChangeRequestDto } from '@/api/generated/models/ApproveChangeRequestDto';
import type { RejectChangeRequestDto } from '@/api/generated/models/RejectChangeRequestDto';
import { unwrapData } from './http';

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
  ).then(unwrapData);
};

export const approveReport = (id: string, data: ApproveChangeRequestDto) => {
  return CategoryUserReportAdminService.categoryUserReportsAdminControllerApprove(id, data).then(unwrapData);
};

export const rejectReport = (id: string, data: RejectChangeRequestDto) => {
  return CategoryUserReportAdminService.categoryUserReportsAdminControllerReject(id, data).then(unwrapData);
};
