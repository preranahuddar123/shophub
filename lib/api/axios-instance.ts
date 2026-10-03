import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach bearer token from env var
apiClient.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_API_BEARER_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - silent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error: ${error.response.status} ${error.config?.url}`);
    } else if (error.request) {
      console.error(`Network Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
