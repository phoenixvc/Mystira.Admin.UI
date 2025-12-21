import { apiClient } from "./client";

export interface AvatarConfiguration {
  ageGroup: string;
  avatarMediaIds: string[];
}

export interface AvatarConfigurationFile {
  avatars: AvatarConfiguration[];
}

export const avatarsApi = {
  getAllAvatars: async (): Promise<AvatarConfigurationFile> => {
    const response = await apiClient.get<AvatarConfigurationFile>("/api/admin/avataradmin");
    return response.data;
  },

  getAvatarsForAgeGroup: async (ageGroup: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(`/api/admin/avataradmin/${ageGroup}`);
    return response.data;
  },

  setAvatarsForAgeGroup: async (
    ageGroup: string,
    mediaIds: string[]
  ): Promise<AvatarConfigurationFile> => {
    const response = await apiClient.post<AvatarConfigurationFile>(
      `/api/admin/avataradmin/${ageGroup}`,
      mediaIds
    );
    return response.data;
  },

  addAvatarToAgeGroup: async (
    ageGroup: string,
    mediaId: string
  ): Promise<AvatarConfigurationFile> => {
    const response = await apiClient.post<AvatarConfigurationFile>(
      `/api/admin/avataradmin/${ageGroup}/add`,
      JSON.stringify(mediaId),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  removeAvatarFromAgeGroup: async (
    ageGroup: string,
    mediaId: string
  ): Promise<AvatarConfigurationFile> => {
    const response = await apiClient.delete<AvatarConfigurationFile>(
      `/api/admin/avataradmin/${ageGroup}/remove/${mediaId}`
    );
    return response.data;
  },
};
