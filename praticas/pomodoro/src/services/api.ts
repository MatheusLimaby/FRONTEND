import type { TaskModel } from '../models/TaskModel';
import type { TaskStateModel } from '../models/TaskStateModel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Helper para pegar o token salvo localmente
function getAuthHeader(): Record<string, string> {
  const sessionData = sessionStorage.getItem('chronos-auth-data');
  if (sessionData) {
    const { token } = JSON.parse(sessionData);
    if (token) return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    let errorDetail = '';
    try { errorDetail = JSON.parse(message).message; } catch { errorDetail = message; }
    throw new Error(errorDetail || `API error: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

// Novos métodos integrados de autenticação
export async function apiLogin(payload: any) {
  return request<{ token: string; user: { name: string; email: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function apiRegister(payload: any) {
  return request<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function apiForgotPassword(email: string) {
  return request<any>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function apiResetPassword(payload: any) {
  return request<any>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Métodos legados protegidos
export async function getSettings() { return request<TaskStateModel['config']>('/settings'); }
export async function updateSettings(config: TaskStateModel['config']) {
  return request<TaskStateModel['config']>('/settings', { method: 'PUT', body: JSON.stringify(config) });
}
export async function getTasks() {
  const tasks = await request<any[]>('/tasks');
  return tasks.map(task => ({
    ...task,
    startDate: Number(task.startDate),
    completeDate: task.completeDate ? Number(task.completeDate) : null,
    interruptDate: task.interruptDate ? Number(task.interruptDate) : null,
  }));
}
export async function createTask(task: TaskModel) { return request<any>('/tasks', { method: 'POST', body: JSON.stringify(task) }); }
export async function completeTask(taskId: string, completeDate: number) {
  return request<any>(`/tasks/${taskId}/complete`, { method: 'PATCH', body: JSON.stringify({ completeDate }) });
}
export async function interruptTask(taskId: string, interruptDate: number) {
  return request<any>(`/tasks/${taskId}/interrupt`, { method: 'PATCH', body: JSON.stringify({ interruptDate }) });
}
export async function clearTasks() { return request<void>('/tasks', { method: 'DELETE' }); }