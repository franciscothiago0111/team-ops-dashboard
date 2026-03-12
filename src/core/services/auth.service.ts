import type { IUser } from "@/shared/types";
import { api } from "../api/http";
import { saveToken, removeToken, saveRefreshToken, removeRefreshToken, getRefreshToken } from "./storage.service";

export interface ILoginCredentials {
  email: string;
  password: string;
}


export interface ILoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: IUser;
}

export interface IRefreshTokenResponse {
  access_token: string;
  expires_in?: number;
}

export const AuthService = {
  login: async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    const response = await api.post<ILoginResponse>("/auth/signin", credentials);
    const { access_token, refresh_token, expires_in } = response;

    saveToken(access_token, expires_in);
    if (refresh_token) {
      saveRefreshToken(refresh_token);
    }

    return response;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Ignore errors — always clear local auth data
    } finally {
      removeToken();
      removeRefreshToken();
    }
  },

  refreshToken: async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.post<IRefreshTokenResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, expires_in } = response;
      saveToken(access_token, expires_in);

      return access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      removeToken();
      removeRefreshToken();
      return null;
    }
  },

  me: async (): Promise<IUser> => {
    return await api.get<IUser>('/auth/me');
  },
};
