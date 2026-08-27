import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://krishikendra.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 70000, // 70 seconds timeout for Render cold-starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with automatic retry on cold-start (502, 503, 504, or Network Error)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Initialize retry count if not present
    if (!config || !config.retry) {
      config.retry = 3;
      config.retryCount = 0;
    }

    const shouldRetry =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      error.response.status === 504;

    if (shouldRetry && config.retryCount < config.retry) {
      config.retryCount += 1;
      const backoffDelay = config.retryCount * 2500; // 2.5s, 5s, 7.5s

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return api(config);
    }

    // 401 unauthorized handling
    if (error.response && error.response.status === 401) {
      const url = config ? config.url : '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('krishi_token');
        localStorage.removeItem('krishi_user');
      }
    }

    return Promise.reject(error);
  }
);

// Health checker to warm up the backend on initial website visit
export const warmUpBackend = async () => {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 15000 });
  } catch (e) {
    // Ignore warmup errors
  }
};

export default api;
