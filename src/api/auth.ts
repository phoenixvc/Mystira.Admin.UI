import { apiClient } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/admin/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/admin/auth/logout");
  },
};
