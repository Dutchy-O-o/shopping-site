import axios from 'axios';

/**
 * Central Axios instance for the whole app.
 *
 * - Base URL comes from the REACT_APP_API_URL environment variable
 *   (see frontend/.env), so it is never hard-coded across pages.
 * - A request interceptor automatically attaches the JWT Bearer token.
 * - A response interceptor logs the user out on 401 (expired/invalid token).
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? 'https://localhost:7192',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the auth token (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid sessions globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      if (window.location.pathname !== '/signup-or-login') {
        window.location.href = '/signup-or-login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
