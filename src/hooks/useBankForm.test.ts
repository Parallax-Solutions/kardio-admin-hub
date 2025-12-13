import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBankForm } from './useBankForm';

// Mock the store hooks
vi.mock('@/stores', () => ({
  useCreateBank: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 'new-id' }),
    isPending: false,
  }),
  useUpdateBank: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 'updated-id' }),
    isPending: false,
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useBankForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with dialog closed', () => {
      const { result } = renderHook(() => useBankForm());
      expect(result.current.isDialogOpen).toBe(false);
    });

    it('should start with no editing bank', () => {
      const { result } = renderHook(() => useBankForm());
      expect(result.current.editingBank).toBeNull();
    });

    it('should have default form data', () => {
      const { result } = renderHook(() => useBankForm());
      expect(result.current.formData).toEqual({
        name: '',
        slug: '',
        country: '',
        isActive: true,
      });
    });
  });

  describe('openCreateDialog', () => {
    it('should open dialog with empty form', () => {
      const { result } = renderHook(() => useBankForm());

      act(() => {
        result.current.openCreateDialog();
      });

      expect(result.current.isDialogOpen).toBe(true);
      expect(result.current.editingBank).toBeNull();
      expect(result.current.formData).toEqual({
        name: '',
        slug: '',
        country: '',
        isActive: true,
      });
    });
  });

  describe('openEditDialog', () => {
    it('should open dialog with bank data', () => {
      const { result } = renderHook(() => useBankForm());
      const mockBank = {
        id: '1',
        name: 'Test Bank',
        slug: 'test-bank',
        country: 'CR',
        isActive: true,
        emailDomains: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      act(() => {
        result.current.openEditDialog(mockBank);
      });

      expect(result.current.isDialogOpen).toBe(true);
      expect(result.current.editingBank).toEqual(mockBank);
      expect(result.current.formData).toEqual({
        name: 'Test Bank',
        slug: 'test-bank',
        country: 'CR',
        isActive: true,
      });
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      const { result } = renderHook(() => useBankForm());

      act(() => {
        result.current.openCreateDialog();
      });
      expect(result.current.isDialogOpen).toBe(true);

      act(() => {
        result.current.closeDialog();
      });
      expect(result.current.isDialogOpen).toBe(false);
    });
  });

  describe('updateFormField', () => {
    it('should update a single form field', () => {
      const { result } = renderHook(() => useBankForm());

      act(() => {
        result.current.updateFormField('name', 'New Bank Name');
      });

      expect(result.current.formData.name).toBe('New Bank Name');
    });

    it('should update boolean fields', () => {
      const { result } = renderHook(() => useBankForm());

      act(() => {
        result.current.updateFormField('isActive', false);
      });

      expect(result.current.formData.isActive).toBe(false);
    });
  });
});
