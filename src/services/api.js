import axios from 'axios';

// --- CONFIGURATION ---

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// --- AXIOS INSTANCE ---
const api = axios.create({
  baseURL: `${BASE_URL}/api`, // We append /api here
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;