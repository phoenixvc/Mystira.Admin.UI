import { apiClient } from "./client";

export interface DashboardStats {
  totalScenarios: number;
  totalMedia: number;
  totalBadges: number;
  totalBundles: number;
}

export const adminApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/admin/stats");
    return response.data;
  },
};
