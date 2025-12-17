import { TransactionsService } from '@/api/generated/services/TransactionsService';
import type { CreateTransactionDto } from '@/api/generated/models/CreateTransactionDto';
import type { UpdateTransactionCategoryDto } from '@/api/generated/models/UpdateTransactionCategoryDto';
import { unwrapData } from './http';

export interface TransactionSummary {
  totalCount?: number;
  totalAmount?: number;
}

export async function listTransactions(params: {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'merchant' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  bankId?: string;
  currency?: string;
  connectionAccountId?: string;
  merchant?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
} = {}) {
  const response = await TransactionsService.transactionsControllerFindAll(
    params.page,
    params.limit,
    params.sortBy,
    params.sortOrder,
    params.startDate,
    params.endDate,
    params.categoryId,
    params.bankId,
    params.currency,
    params.connectionAccountId,
    params.merchant,
    params.search,
    params.minAmount,
    params.maxAmount
  );
  return response;
}

export async function getTransactionSummary(params: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  bankId?: string;
  merchant?: string;
  search?: string;
  transactionType?: string[];
  reconciliationStatus?: string[];
  minAmount?: number;
  maxAmount?: number;
} = {}) {
  const response = await TransactionsService.transactionsControllerGetSummary(
    params.startDate,
    params.endDate,
    params.categoryId,
    params.bankId,
    params.merchant,
    params.search,
    params.transactionType,
    params.reconciliationStatus,
    params.minAmount,
    params.maxAmount
  );
  return unwrapData<TransactionSummary>(response);
}

export async function createTransaction(data: CreateTransactionDto) {
  const response = await TransactionsService.transactionsControllerCreate(data);
  return unwrapData<unknown>(response);
}

export async function getTransaction(id: string) {
  const response = await TransactionsService.transactionsControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function deleteTransaction(id: string) {
  const response = await TransactionsService.transactionsControllerRemove(id);
  return unwrapData<unknown>(response);
}

export async function updateTransactionCategory(id: string, data: UpdateTransactionCategoryDto) {
  const response = await TransactionsService.transactionsControllerUpdateCategory(id, data);
  return unwrapData<unknown>(response);
}
