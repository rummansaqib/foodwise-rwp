import { getToken } from './storageService';

/**
 * Talks to the optional FastAPI backend (see /backend). If no backend is
 * reachable -- e.g. running `npm run dev` standalone, or a static
 * GitHub Pages deploy with no server -- callers should catch the error
 * from checkBackend()/request() and fall back to the local mock data +
 * storageService, so the app keeps working exactly as the prototype
 * requirements demand ("everything must work immediately, no backend
 * required"). When a backend *is* configured and reachable, the app uses
 * real accounts and a real database instead.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let backendAvailable: boolean | null = null;

export async function checkBackend(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

export function resetBackendCheck() {
  backendAvailable = null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

// ---------- Auth ----------
export const api = {
  signup: (name: string, email: string, password: string) =>
    request<{ access_token: string; user: any }>('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    request<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => request<any>('/auth/me'),

  updateProfile: (payload: Record<string, unknown>) =>
    request<any>('/auth/me', { method: 'PUT', body: JSON.stringify(payload) }),

  // ---------- Restaurants ----------
  listRestaurants: (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
    ).toString();
    return request<any[]>(`/restaurants${query ? `?${query}` : ''}`);
  },
  getRestaurant: (id: number | string) => request<any>(`/restaurants/${id}`),

  // ---------- Recommendation ----------
  findFood: (payload: Record<string, unknown>) =>
    request<any[]>('/recommend/find-food', { method: 'POST', body: JSON.stringify(payload) }),

  // ---------- History / Favorites ----------
  getHistory: () => request<any[]>('/history'),
  addHistory: (payload: Record<string, unknown>) =>
    request<any>('/history', { method: 'POST', body: JSON.stringify(payload) }),
  getBehaviorInsights: () => request<any>('/history/behavior'),
  getFavorites: () => request<any[]>('/favorites'),
  toggleFavorite: (payload: Record<string, unknown>) =>
    request<any>('/favorites/toggle', { method: 'POST', body: JSON.stringify(payload) }),

  // ---------- Reviews ----------
  getReviews: (restaurantId: number | string) => request<any[]>(`/reviews/restaurant/${restaurantId}`),
  createReview: (payload: Record<string, unknown>) =>
    request<any>('/reviews', { method: 'POST', body: JSON.stringify(payload) }),

  // ---------- Admin ----------
  adminStats: () => request<any>('/admin/stats'),
  createRestaurant: (payload: Record<string, unknown>) =>
    request<any>('/admin/restaurants', { method: 'POST', body: JSON.stringify(payload) }),
  updateRestaurant: (id: number | string, payload: Record<string, unknown>) =>
    request<any>(`/admin/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteRestaurant: (id: number | string) => request<any>(`/admin/restaurants/${id}`, { method: 'DELETE' }),
};

export { BASE_URL };
