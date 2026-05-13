import type { TaskModel } from '../models/TaskModel';
import type { TaskStateModel } from '../models/TaskStateModel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

type ApiTask = Omit<TaskModel, 'startDate' | 'completeDate' | 'interruptDate'> & {
  startDate: string | number;
  completeDate: string | number | null;
  interruptDate: string | number | null;
};

export type AuthUser = { id: string; email: string; name: string | null };

function normalizeTask(task: ApiTask): TaskModel {
  return { ...task, startDate: Number(task.startDate), completeDate: task.completeDate === null ? null : Number(task.completeDate), interruptDate: task.interruptDate === null ? null : Number(task.interruptDate) };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('chronos-token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: '' }));
    throw new Error(body.message || `API error: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const register = (payload: { email: string; password: string; name?: string }) => request<AuthUser>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const loginApi = (payload: { email: string; password: string }) => request<{ token: string; user: AuthUser; expiresAt: string }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
export const me = () => request<AuthUser>('/auth/me');
export const logoutApi = () => request<void>('/auth/logout', { method: 'POST' });
export const forgotPassword = (email: string) => request<{ message: string; resetToken?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
export const resetPassword = (token: string, newPassword: string) => request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) });

export const getSettings = () => request<TaskStateModel['config']>('/settings');
export const updateSettings = (config: TaskStateModel['config']) => request<TaskStateModel['config']>('/settings', { method: 'PUT', body: JSON.stringify(config) });
export const getTasks = async () => (await request<ApiTask[]>('/tasks')).map(normalizeTask);
export const createTask = (task: TaskModel) => request<ApiTask>('/tasks', { method: 'POST', body: JSON.stringify(task) });
export const completeTask = (taskId: string, completeDate: number) => request<ApiTask>(`/tasks/${taskId}/complete`, { method: 'PATCH', body: JSON.stringify({ completeDate }) });
export const interruptTask = (taskId: string, interruptDate: number) => request<ApiTask>(`/tasks/${taskId}/interrupt`, { method: 'PATCH', body: JSON.stringify({ interruptDate }) });
export const clearTasks = () => request<void>('/tasks', { method: 'DELETE' });
