import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserRoleChange } from './useUserRoleChange';

// Mock the store hooks
vi.mock('@/stores', () => ({
  useUpdateUserRole: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useUserRoleChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with dialog closed', () => {
      const { result } = renderHook(() => useUserRoleChange());
      expect(result.current.confirmDialog.open).toBe(false);
    });

    it('should start with no user selected', () => {
      const { result } = renderHook(() => useUserRoleChange());
      expect(result.current.confirmDialog.user).toBeNull();
    });

    it('should start with no new role', () => {
      const { result } = renderHook(() => useUserRoleChange());
      expect(result.current.confirmDialog.newRole).toBeNull();
    });
  });

  describe('handleRoleChange', () => {
    it('should open dialog when role is different', () => {
      const { result } = renderHook(() => useUserRoleChange());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT' as const,
        image: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      act(() => {
        result.current.handleRoleChange(mockUser, 'ADMIN');
      });

      expect(result.current.confirmDialog.open).toBe(true);
      expect(result.current.confirmDialog.user).toEqual(mockUser);
      expect(result.current.confirmDialog.newRole).toBe('ADMIN');
    });

    it('should not open dialog when role is the same', () => {
      const { result } = renderHook(() => useUserRoleChange());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT' as const,
        image: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      act(() => {
        result.current.handleRoleChange(mockUser, 'CLIENT');
      });

      expect(result.current.confirmDialog.open).toBe(false);
    });
  });

  describe('closeDialog', () => {
    it('should reset dialog state', () => {
      const { result } = renderHook(() => useUserRoleChange());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT' as const,
        image: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      act(() => {
        result.current.handleRoleChange(mockUser, 'ADMIN');
      });
      expect(result.current.confirmDialog.open).toBe(true);

      act(() => {
        result.current.closeDialog();
      });

      expect(result.current.confirmDialog.open).toBe(false);
      expect(result.current.confirmDialog.user).toBeNull();
      expect(result.current.confirmDialog.newRole).toBeNull();
    });
  });
});
