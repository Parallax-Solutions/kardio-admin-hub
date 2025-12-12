import { UsersService } from '@/api/generated/services/UsersService';
import { unwrapData } from './http';
import type { UpdateUserRoleDto } from '@/api/generated/models/UpdateUserRoleDto';

export async function listUsers() {
  const response = await UsersService.usersControllerFindAll();
  return unwrapData<unknown>(response);
}

export async function getUser(id: string) {
  const response = await UsersService.usersControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function updateUserRole(params: { id: string; role: UpdateUserRoleDto['role'] }) {
  const dto: UpdateUserRoleDto = { role: params.role };
  const response = await UsersService.usersControllerUpdateRole(params.id, dto);
  return unwrapData<unknown>(response);
}
