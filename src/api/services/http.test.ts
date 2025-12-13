import { describe, it, expect } from 'vitest';
import { unwrapData } from './http';

describe('unwrapData', () => {
  it('should extract data from response envelope', () => {
    const response = { data: { id: '1', name: 'Test' }, success: true };
    const result = unwrapData<{ id: string; name: string }>(response);
    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('should return response as-is when no data property exists', () => {
    const response = { id: '1', name: 'Test' };
    const result = unwrapData<{ id: string; name: string }>(response);
    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('should handle null response', () => {
    const result = unwrapData<null>(null);
    expect(result).toBeNull();
  });

  it('should handle undefined response', () => {
    const result = unwrapData<undefined>(undefined);
    expect(result).toBeUndefined();
  });

  it('should handle primitive values', () => {
    const result = unwrapData<string>('test');
    expect(result).toBe('test');
  });

  it('should handle array responses', () => {
    const response = { data: [1, 2, 3] };
    const result = unwrapData<number[]>(response);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle nested data objects', () => {
    const response = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        token: 'abc123',
      },
    };
    const result = unwrapData<{ user: { id: string; email: string }; token: string }>(response);
    expect(result).toEqual({
      user: { id: '1', email: 'test@example.com' },
      token: 'abc123',
    });
  });
});
