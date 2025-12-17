import { BanksService } from '@/api/generated/services/BanksService';
import type { CreateBankDto } from '@/api/generated/models/CreateBankDto';
import type { UpdateBankDto } from '@/api/generated/models/UpdateBankDto';
import { unwrapData } from './http';

export async function listBanks(params: {
  sortBy?: 'name' | 'countryCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  country?: string;
  active?: boolean;
  search?: string;
} = {}) {
  const response = await BanksService.banksControllerFindAll(
    params.sortBy,
    params.sortOrder,
    params.active,
    params.country,
    params.search
  );
  return unwrapData<unknown>(response);
}

export async function getBank(id: string) {
  const response = await BanksService.banksControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function createBank(data: CreateBankDto) {
  const response = await BanksService.banksControllerCreate(data);
  return unwrapData<unknown>(response);
}

export async function updateBank(id: string, data: UpdateBankDto) {
  const response = await BanksService.banksControllerUpdate(id, data);
  return unwrapData<unknown>(response);
}

export async function deleteBank(id: string) {
  const response = await BanksService.banksControllerRemove(id);
  return unwrapData<unknown>(response);
}

export async function toggleBankActive(id: string) {
  const response = await BanksService.banksControllerToggleActive(id);
  return unwrapData<unknown>(response);
}
