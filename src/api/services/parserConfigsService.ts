import { ParserConfigsService } from '@/api/generated/services/ParserConfigsService';
import type { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';
import type { UpdateParserConfigDto } from '@/api/generated/models/UpdateParserConfigDto';
import type { TestParserConfigDto } from '@/api/generated/models/TestParserConfigDto';
import { unwrapData } from './http';

export async function listParserConfigs(filters: {
  sortBy?: 'name' | 'bankId' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  bankId?: string;
  active?: boolean;
  search?: string;
}) {
  const response = await ParserConfigsService.parserConfigsControllerFindAll(
    filters.sortBy,
    filters.sortOrder,
    filters.bankId,
    filters.active,
    filters.search
  );
  return unwrapData<unknown>(response);
}

export async function getParserConfig(id: string) {
  const response = await ParserConfigsService.parserConfigsControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function createParserConfig(data: CreateParserConfigDto) {
  const response = await ParserConfigsService.parserConfigsControllerCreate(data);
  return unwrapData<unknown>(response);
}

export async function updateParserConfig(id: string, data: UpdateParserConfigDto) {
  const response = await ParserConfigsService.parserConfigsControllerUpdate(id, data);
  return unwrapData<unknown>(response);
}

export async function deleteParserConfig(id: string) {
  const response = await ParserConfigsService.parserConfigsControllerRemove(id);
  return unwrapData<unknown>(response);
}

export async function activateParserConfig(id: string) {
  const response = await ParserConfigsService.parserConfigsControllerActivate(id);
  return unwrapData<unknown>(response);
}

export async function deactivateParserConfig(id: string) {
  const response = await ParserConfigsService.parserConfigsControllerDeactivate(id);
  return unwrapData<unknown>(response);
}

export async function getActiveParserConfigByBank(bankId: string) {
  const response = await ParserConfigsService.parserConfigsControllerFindActiveByBank(bankId);
  return unwrapData<unknown>(response);
}

export async function testParserConfig(data: TestParserConfigDto) {
  const response = await ParserConfigsService.parserConfigsControllerTestParser(data);
  return unwrapData<unknown>(response);
}
