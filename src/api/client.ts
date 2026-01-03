import axios, { InternalAxiosRequestConfig } from "axios";
import { msalInstance } from "../auth/msalInstance";
import { tokenRequest } from "../auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add MSAL access token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token acquisition if auth bypass is enabled
    if (BYPASS_AUTH) {
      console.log("Auth bypass enabled - skipping token acquisition");
      return config;
    }

    const account = msalInstance.getActiveAccount();

    if (account) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...tokenRequest,
          account,
        });
        
        if (config.headers) {
          config.headers.Authorization = `Bearer ${response.accessToken}`;
        }
      } catch (error) {
        console.error("Token acquisition failed:", error);
        // Let the request proceed without token - backend will return 401 if needed
      }
    }

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
      // Unauthorized - redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
