import { api } from "../api/http";
import { saveToken, removeToken, saveRefreshToken, removeRefreshToken, getRefreshToken } from "./storage.service";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in?: number;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/signin", credentials);
    const { access_token, refresh_token, expires_in } = response;

    saveToken(access_token, expires_in);
    if (refresh_token) {
      saveRefreshToken(refresh_token);
    }

    return response;
  },

  logout: () => {
    removeToken();
    removeRefreshToken();
  },

  refreshToken: async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.post<RefreshTokenResponse>("/auth/refresh", {
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

  me: async (): Promise<AuthUser> => {
    return await api.get<AuthUser>('/auth/me');
  },
};
