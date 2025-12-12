export function unwrapData<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in (response as any)) {
    return (response as any).data as T;
  }
  return response as T;
}
