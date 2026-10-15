import { Category, PublicProblem, AdminProblem, DashboardStats } from '../types';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('problempulse_admin_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('problempulse_admin_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('problempulse_admin_token');
};

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.message || (data?.errors ? data.errors.map((e: any) => e.message).join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }
  return data;
}

// Public API
export async function fetchCategories(): Promise<{ success: boolean; data: Category[] }> {
  const res = await fetch(`${API_BASE}/categories`);
  return handleResponse(res);
}

export async function fetchPublicProblems(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: 'recent' | 'supporters';
}): Promise<{
  success: boolean;
  data: PublicProblem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.status) query.set('status', params.status);
  if (params.sortBy) query.set('sortBy', params.sortBy);

  const res = await fetch(`${API_BASE}/problems?${query.toString()}`);
  return handleResponse(res);
}

export async function fetchPublicProblemById(id: string): Promise<{ success: boolean; data: PublicProblem }> {
  const res = await fetch(`${API_BASE}/problems/${id}`);
  return handleResponse(res);
}

export async function submitProblem(payload: any): Promise<{ success: boolean; message: string; data: any }> {
  const res = await fetch(`${API_BASE}/problems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function supportProblem(id: string): Promise<{ success: boolean; message: string; supportCount: number }> {
  const res = await fetch(`${API_BASE}/problems/${id}/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
}

export async function submitTestInterest(
  id: string,
  data: { email?: string; roleOrBackground?: string }
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/problems/${id}/test-interest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function reportAbuse(
  id: string,
  data: { reason: string; details?: string }
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/problems/${id}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Admin API
function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminLogin(credentials: { email: string; password: string }): Promise<{
  success: boolean;
  token: string;
  user: { id: string; email: string; name: string; role: string };
}> {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse<any>(res);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function fetchAdminDashboard(): Promise<{ success: boolean; data: DashboardStats }> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchAdminProblems(params: {
  page?: number;
  limit?: number;
  search?: string;
  moderationStatus?: string;
  researchStatus?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{
  success: boolean;
  data: AdminProblem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.moderationStatus) query.set('moderationStatus', params.moderationStatus);
  if (params.researchStatus) query.set('researchStatus', params.researchStatus);
  if (params.categoryId) query.set('categoryId', params.categoryId);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const res = await fetch(`${API_BASE}/admin/problems?${query.toString()}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchAdminProblemById(id: string): Promise<{ success: boolean; data: AdminProblem }> {
  const res = await fetch(`${API_BASE}/admin/problems/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function updateModerationStatus(
  id: string,
  status: string
): Promise<{ success: boolean; message: string; data: AdminProblem }> {
  const res = await fetch(`${API_BASE}/admin/problems/${id}/moderation`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function updateResearchStatus(
  id: string,
  status: string,
  note?: string
): Promise<{ success: boolean; message: string; data: AdminProblem }> {
  const res = await fetch(`${API_BASE}/admin/problems/${id}/research-status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status, note }),
  });
  return handleResponse(res);
}

export async function updateRubricScore(
  id: string,
  scores: {
    scoreFrequency: number;
    scoreSeverity: number;
    scoreUnmetDemand: number;
    scoreFeasibility: number;
    scoreUserAccess: number;
  }
): Promise<{ success: boolean; message: string; data: AdminProblem }> {
  const res = await fetch(`${API_BASE}/admin/problems/${id}/score`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(scores),
  });
  return handleResponse(res);
}

export async function addResearchNote(
  id: string,
  content: string
): Promise<{ success: boolean; message: string; data: any }> {
  const res = await fetch(`${API_BASE}/admin/problems/${id}/notes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  return handleResponse(res);
}

export async function deleteProblem(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/problems/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}
