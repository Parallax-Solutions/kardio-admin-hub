import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAPI } from '@/api/generated/core/OpenAPI';
import { environment } from '@/config/environment';
import type { AdminLoginDto } from '@/api/generated/models/AdminLoginDto';
import { adminLogin, logout as apiLogout, refresh as apiRefresh, getCurrentUser as apiGetCurrentUser } from '@/api/services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN';
  image?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: AdminLoginDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

type AuthStore = AuthState & AuthActions;

// Configurar OpenAPI con el token dinámicamente
const configureOpenAPI = (token: string | null) => {
  OpenAPI.TOKEN = token ?? undefined;
  OpenAPI.BASE = environment.apiBaseUrl;
  OpenAPI.WITH_CREDENTIALS = true;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: AdminLoginDto) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await adminLogin(credentials);
          
          console.log('Login response:', response);
          
          // Backend usa statusCode en lugar de success
          const isSuccess = response.success || (response as { statusCode?: number }).statusCode === 200;
          
          if (isSuccess && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            
            if (accessToken && refreshToken && user) {
              configureOpenAPI(accessToken);
              
              set({
                user: {
                  id: user.id!,
                  email: user.email!,
                  name: user.name!,
                  role: user.role!,
                },
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return;
            }
          }
          
          // Si llegamos aquí, la respuesta no tiene los datos esperados
          set({ 
            isLoading: false, 
            error: 'Respuesta inválida del servidor',
            isAuthenticated: false,
          });
        } catch (error: unknown) {
          console.error('Login error:', error);
          const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
          set({ 
            isLoading: false, 
            error: message,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await apiLogout();
        } catch {
          // Ignorar errores de logout, limpiar estado de todas formas
        } finally {
          configureOpenAPI(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          return false;
        }

        try {
          const response = await apiRefresh();
          
          if (response.success) {
            // El backend maneja los tokens via cookies, 
            // pero si devuelve nuevos tokens, los actualizamos
            await get().fetchCurrentUser();
            return true;
          }
          
          return false;
        } catch {
          // Si falla el refresh, cerrar sesión
          await get().logout();
          return false;
        }
      },

      fetchCurrentUser: async () => {
        const { accessToken } = get();
        
        if (!accessToken) {
          return;
        }

        configureOpenAPI(accessToken);
        set({ isLoading: true });

        try {
          const response = await apiGetCurrentUser();
          
          if (response.success && response.data) {
            const userData = response.data as { id?: string; email?: string; name?: string; image?: string };
            set({
              user: {
                id: userData.id!,
                email: userData.email!,
                name: userData.name || userData.email!,
                role: 'ADMIN',
                image: userData.image,
              },
              isLoading: false,
            });
          }
        } catch (error: unknown) {
          // Si el token expiró, intentar refresh
          const refreshed = await get().refreshSession();
          
          if (!refreshed) {
            set({ isLoading: false });
          }
        }
      },

      clearError: () => set({ error: null }),

      setTokens: (accessToken: string, refreshToken: string) => {
        configureOpenAPI(accessToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook selector para evitar re-renders innecesarios
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
