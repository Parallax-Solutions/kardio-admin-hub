import { OpenAPI } from '@/api/generated/core/OpenAPI';

export const environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Configurar OpenAPI al cargar el módulo
OpenAPI.BASE = environment.apiBaseUrl;
OpenAPI.WITH_CREDENTIALS = true;
