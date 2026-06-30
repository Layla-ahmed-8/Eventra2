import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL as string | undefined;
const isMockMode = !baseURL;

export const api = axios.create({
  baseURL: baseURL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (isMockMode) {
    return Promise.reject(new Error('MOCK_MODE'));
  }
  const token = localStorage.getItem('eventra-access-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// Events
export const eventsApi = {
  list: (params?: Record<string, string>) => api.get('/events', { params }),
  get: (id: string) => api.get(`/events/${id}`),
  create: (data: Record<string, unknown>) => api.post('/events', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  duplicate: (id: string) => api.post(`/events/${id}/duplicate`),
};

// Notifications
export const notificationsApi = {
  list: () => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  dismiss: (id: string) => api.delete(`/notifications/${id}`),
};

export { isMockMode };
