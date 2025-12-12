import { AuthService } from '@/api/generated/services/AuthService';
import type { AdminLoginDto } from '@/api/generated/models/AdminLoginDto';

export async function adminLogin(credentials: AdminLoginDto) {
  const response = await AuthService.adminAuthControllerLogin(credentials);
  return response;
}

export async function logout() {
  const response = await AuthService.authControllerLogout();
  return response;
}

export async function refresh() {
  const response = await AuthService.authControllerRefresh();
  return response;
}

export async function getCurrentUser() {
  const response = await AuthService.authControllerGetCurrentUser();
  return response;
}
