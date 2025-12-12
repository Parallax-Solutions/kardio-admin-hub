import { CurrenciesService } from '@/api/generated/services/CurrenciesService';
import type { CreateCurrencyDto } from '@/api/generated/models/CreateCurrencyDto';
import type { UpdateCurrencyStatusDto } from '@/api/generated/models/UpdateCurrencyStatusDto';
import { unwrapData } from './http';

export async function listCurrencies(params: {
  page: number;
  limit: number;
  search?: string;
  status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED';
}) {
  const response = await CurrenciesService.currenciesControllerFindAll(
    params.page,
    params.limit,
    params.search,
    params.status
  );
  return response;
}

export async function getCurrency(code: string) {
  const response = await CurrenciesService.currenciesControllerFindOne(code);
  return unwrapData<unknown>(response);
}

export async function createCurrency(data: CreateCurrencyDto) {
  const response = await CurrenciesService.currenciesControllerCreate(data);
  return unwrapData<unknown>(response);
}

export async function deleteCurrency(code: string) {
  const response = await CurrenciesService.currenciesControllerDelete(code);
  return unwrapData<unknown>(response);
}

export async function updateCurrencyStatus(code: string, status: UpdateCurrencyStatusDto['status']) {
  const response = await CurrenciesService.currenciesControllerUpdateStatus(code, { status });
  return unwrapData<unknown>(response);
}

export async function getCurrenciesStats() {
  const response = await CurrenciesService.currenciesControllerGetStats();
  return unwrapData<unknown>(response);
}
