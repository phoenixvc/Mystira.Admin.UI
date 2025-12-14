import axios from "axios";
import { useAuthStore } from "../state/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookie-based auth
});

// Request interceptor - cookies are handled automatically by browser
// No need to add Authorization header for cookie-based auth
apiClient.interceptors.request.use(
  config => {
    // Cookies are sent automatically with withCredentials: true
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
