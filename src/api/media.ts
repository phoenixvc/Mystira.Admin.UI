import { apiClient } from "./client";

export interface MediaAsset {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface MediaQueryRequest {
  page?: number;
  pageSize?: number;
  type?: string;
  searchTerm?: string;
}

export interface MediaQueryResponse {
  media: MediaAsset[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const mediaApi = {
  getMedia: async (request?: MediaQueryRequest): Promise<MediaQueryResponse> => {
    const response = await apiClient.get<MediaQueryResponse>(
      "/api/admin/mediaadmin",
      { params: request }
    );
    return response.data;
  },

  getMediaFile: async (mediaId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/admin/mediaadmin/${mediaId}`, {
      responseType: "blob",
    });
    return response.data;
  },

  uploadMedia: async (
    file: File,
    metadata?: Record<string, unknown>
  ): Promise<MediaAsset> => {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    const response = await apiClient.post<MediaAsset>(
      "/api/admin/mediaadmin/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteMedia: async (mediaId: string): Promise<void> => {
    await apiClient.delete(`/api/admin/mediaadmin/${mediaId}`);
  },
};
