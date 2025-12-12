import { CurrencySynonymsService } from '@/api/generated/services/CurrencySynonymsService';
import { unwrapData } from './http';
import type { BulkMapSynonymsDto } from '@/api/generated/models/BulkMapSynonymsDto';

export async function listCurrencySynonyms(params: {
  page: number;
  limit: number;
  search?: string;
  status?: 'UNMAPPED' | 'MAPPED';
}) {
  const response = await CurrencySynonymsService.currencySynonymsControllerFindAll(
    params.page,
    params.limit,
    params.search,
    params.status
  );
  return response;
}

export async function listUnmappedCurrencySynonyms(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  const response = await CurrencySynonymsService.currencySynonymsControllerFindUnmapped(
    params.page,
    params.limit,
    params.search
  );
  return response;
}

export async function getCurrencySynonym(id: string) {
  const response = await CurrencySynonymsService.currencySynonymsControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function listCurrencySynonymsByCurrency(currencyCode: string) {
  const response = await CurrencySynonymsService.currencySynonymsControllerFindByCurrency(currencyCode);
  return unwrapData<unknown>(response);
}

export async function mapSynonymToCurrency(params: { id: string; currencyCode: string }) {
  const response = await CurrencySynonymsService.currencySynonymsControllerMapToCurrency(params.id, {
    currencyCode: params.currencyCode,
  });
  return unwrapData<unknown>(response);
}

export async function bulkMapSynonyms(mappings: BulkMapSynonymsDto['mappings']) {
  const response = await CurrencySynonymsService.currencySynonymsControllerBulkMap({ mappings });
  return unwrapData<unknown>(response);
}

export async function getCurrencySynonymsStats() {
  const response = await CurrencySynonymsService.currencySynonymsControllerGetStats();
  return unwrapData<unknown>(response);
}
