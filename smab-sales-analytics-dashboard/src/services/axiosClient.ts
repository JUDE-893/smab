// lib/axiosClient.js
import axios from 'axios';

console.log("process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL", process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL);
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://217.65.146.240:3004/api/proxy', // Use env for flexibility
  timeout: 0,
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

    if (`${response.data.statusCode}`.startsWith('4')) {
      window.location.href = "/login";
    }
    return response;
  },
  (error) => {
    // Optional: handle global errors like 401, 500 etc.
    if (error.response?.status === 401) {
      // Redirect to login or show message      
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
