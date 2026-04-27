import axios from 'axios';

/**
 * Axios instance configured to communicate with the FastAPI backend.
 * Uses relative URL '/api' which is proxied via vite.config.ts in development.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
