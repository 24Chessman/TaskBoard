import axios from 'axios';

const TOKEN_KEY = 'taskboard_token';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage unavailable: the session lasts until the page is closed
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // nothing to clear
  }
};

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 anywhere except login/register means the session is gone: clear it and go to /login.
// A failed login also returns 401, so those two requests are skipped.
const AUTH_PATHS = ['/auth/login', '/auth/register'];

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !AUTH_PATHS.some((path) => url.includes(path))) {
      clearToken();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login?reason=expired');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
