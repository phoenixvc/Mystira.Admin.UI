import { apiClient } from "./client";

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  ageRating: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateScenarioRequest {
  title: string;
  description?: string;
  ageRating: number;
  tags?: string[];
  // Add other scenario fields as needed
}

export interface ScenarioQueryRequest {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface ScenarioQueryResponse {
  scenarios: Scenario[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const scenariosApi = {
  getScenarios: async (
    request?: ScenarioQueryRequest
  ): Promise<ScenarioQueryResponse> => {
    const response = await apiClient.get<ScenarioQueryResponse>(
      "/api/admin/scenariosadmin",
      { params: request }
    );
    return response.data;
  },

  getScenario: async (id: string): Promise<Scenario> => {
    const response = await apiClient.get<Scenario>(
      `/api/admin/scenariosadmin/${id}`
    );
    return response.data;
  },

  createScenario: async (request: CreateScenarioRequest): Promise<Scenario> => {
    const response = await apiClient.post<Scenario>(
      "/api/admin/scenariosadmin",
      request
    );
    return response.data;
  },

  updateScenario: async (
    id: string,
    request: CreateScenarioRequest
  ): Promise<Scenario> => {
    const response = await apiClient.put<Scenario>(
      `/api/admin/scenariosadmin/${id}`,
      request
    );
    return response.data;
  },

  deleteScenario: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/scenariosadmin/${id}`);
  },

  uploadScenario: async (
    file: File,
    overwriteExisting = false
  ): Promise<{ success: boolean; message: string; scenarioId?: string }> => {
    const formData = new FormData();
    formData.append("scenarioFile", file);
    formData.append("overwriteExisting", overwriteExisting.toString());

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      scenarioId?: string;
    }>("/admin/scenarios/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
