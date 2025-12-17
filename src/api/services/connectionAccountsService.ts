import { ConnectionAccountsService } from '@/api/generated/services/ConnectionAccountsService';
import type { AddBankDto } from '@/api/generated/models/AddBankDto';
import type { SyncOptionsDto } from '@/api/generated/models/SyncOptionsDto';
import type { ToggleBankDto } from '@/api/generated/models/ToggleBankDto';
import { unwrapData } from './http';

export async function initiateConnect(provider: string, bankIds: string) {
  return ConnectionAccountsService.connectionAccountsControllerInitiateConnect(provider, bankIds);
}

export async function oauthCallback(code: string, state: string, error: string) {
  const response = await ConnectionAccountsService.connectionAccountsControllerOauthCallback(code, state, error);
  return unwrapData<unknown>(response);
}

export async function listConnectionAccounts(params: {
  sortBy?: 'email' | 'provider' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  provider?: string;
  status?: 'active' | 'inactive' | 'error';
  search?: string;
} = {}) {
  const response = await ConnectionAccountsService.connectionAccountsControllerFindAll(
    params.sortBy,
    params.sortOrder,
    params.provider,
    params.status,
    params.search
  );
  return unwrapData<unknown>(response);
}

export async function getConnectionAccount(id: string) {
  const response = await ConnectionAccountsService.connectionAccountsControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function deleteConnectionAccount(id: string) {
  await ConnectionAccountsService.connectionAccountsControllerRemove(id);
}

export async function syncConnectionAccount(id: string, options: SyncOptionsDto) {
  const response = await ConnectionAccountsService.connectionAccountsControllerSync(id, options);
  return unwrapData<unknown>(response);
}

export async function addBankToConnection(id: string, data: AddBankDto) {
  const response = await ConnectionAccountsService.connectionAccountsControllerAddBank(id, data);
  return unwrapData<unknown>(response);
}

export async function removeBankFromConnection(id: string, bankId: string) {
  await ConnectionAccountsService.connectionAccountsControllerRemoveBank(id, bankId);
}

export async function toggleBankStatusInConnection(id: string, bankId: string, data: ToggleBankDto) {
  const response = await ConnectionAccountsService.connectionAccountsControllerToggleBankStatus(id, bankId, data);
  return unwrapData<unknown>(response);
}
