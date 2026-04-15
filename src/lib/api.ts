import { getAuthToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export type ApiError = { message: string; code?: string; details?: unknown };
export type ApiResponse<T> = { success: true; data: T; error: null } | { success: false; data: null; error: ApiError };

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (!res.ok) {
    const message = json && 'error' in json && json.error?.message ? json.error.message : `Request failed (${res.status})`;
    throw new Error(message);
  }
  if (!json || (json as any).success !== true) {
    throw new Error('Unexpected API response');
  }
  return (json as any).data as T;
}

