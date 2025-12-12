/**
 * Bank domain types
 * Re-exports from store for consistency, can be extended with frontend-specific types
 */
export type { Bank } from '@/stores/banksStore';

export interface BankFormData {
  name: string;
  slug: string;
  country: string;
  isActive: boolean;
}
