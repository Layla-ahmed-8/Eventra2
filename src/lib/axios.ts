import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const isMockMode = import.meta.env.VITE_ENABLE_MOCK_AI === 'true' || !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const stored = localStorage.getItem('eventra-storage');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch { /* ignore parse errors */ }
  }
  return config;
});

// Auto-refresh on 401, logout on refresh failure
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!isMockMode) {
          const stored = localStorage.getItem('eventra-storage');
          const { state } = JSON.parse(stored || '{}');
          if (state?.refreshToken) {
            const { data } = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/refresh`,
              { refreshToken: state.refreshToken }
            );
            original.headers.Authorization = `Bearer ${(data as { accessToken: string }).accessToken}`;
            return api(original);
          }
        }
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { isMockMode };
export default api;
