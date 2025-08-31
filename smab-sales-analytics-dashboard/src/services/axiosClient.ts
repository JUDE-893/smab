// lib/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Use env for flexibility
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛫 Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Example: Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 🛬 Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    // Optional: handle global errors like 401, 500 etc.
    if (error.response?.status === 401) {
      // Redirect to login or show message
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
