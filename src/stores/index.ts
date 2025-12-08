// Auth Store
export {
  useAuthStore,
  useUser as useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
} from './authStore';

// Banks Store - TanStack Query + Zustand UI
export {
  // Query hooks
  useBanks,
  useBank,
  useCreateBank,
  useUpdateBank,
  useDeleteBank,
  useToggleBankActive,
  // UI state
  useBanksUIStore,
  useBanksFilters,
  useSelectedBank,
  useSetBanksFilters,
  useResetBanksFilters,
  useSetSelectedBank,
  // Query keys
  banksKeys,
  // Types
  type Bank,
  type BanksFilters,
} from './banksStore';

// Parser Configs Store - TanStack Query + Zustand UI
export {
  // Query hooks
  useParserConfigs,
  useParserConfig,
  useActiveParserConfigByBank,
  useCreateParserConfig,
  useUpdateParserConfig,
  useDeleteParserConfig,
  useActivateParserConfig,
  useDeactivateParserConfig,
  useTestParser,
  // UI state
  useParserConfigsUIStore,
  useParserConfigsFilters,
  useSelectedParserConfig,
  useTestParserResult,
  useSetParserConfigsFilters,
  useResetParserConfigsFilters,
  useSetSelectedParserConfig,
  useClearTestResult,
  // Query keys
  parserConfigsKeys,
  // Types
  type ParserConfig,
  type ParserStrategy,
  EmailKind,
  type TestParserResult,
  type ParserConfigsFilters,
} from './parserConfigsStore';

// Users Store - TanStack Query + Zustand UI
export {
  // Query hooks
  useUsers,
  useUser,
  useUpdateUserRole,
  useUsersStats,
  // UI state
  useUsersUIStore,
  useUsersFilters,
  useSelectedUser,
  useSetUsersFilters,
  useResetUsersFilters,
  useSetSelectedUser,
  // Query keys
  usersKeys,
  // Types
  type User,
  type UserRole,
  type UsersFilters,
} from './usersStore';
