import { MerchantSimilarityAdminService } from '@/api/generated/services/MerchantSimilarityAdminService';

export const getSuggestions = (params: {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  limit?: number;
  offset?: number;
}) => {
  return MerchantSimilarityAdminService.merchantSimilarityControllerGetSuggestions(
    params.status,
    params.limit,
    params.offset
  );
};

export const getPendingCount = () => {
  return MerchantSimilarityAdminService.merchantSimilarityControllerGetPendingCount();
};

export const acceptSuggestion = (id: string) => {
  return MerchantSimilarityAdminService.merchantSimilarityControllerAcceptSuggestion(id);
};

export const rejectSuggestion = (id: string) => {
  return MerchantSimilarityAdminService.merchantSimilarityControllerRejectSuggestion(id);
};

export const runSimilarityJob = () => {
  return MerchantSimilarityAdminService.merchantSimilarityControllerRunSimilarityJob();
};
