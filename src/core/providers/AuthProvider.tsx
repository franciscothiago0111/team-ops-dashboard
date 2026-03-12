"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect } from "react";
import { getToken, saveUser, getUser, removeUser, clearAuthData } from "../services/storage.service";
import { AuthService } from "../services/auth.service";
import { initSocket, closeSocket } from "../services/io.service";
import { jwtDecode } from "jwt-decode";
import type { IUser } from "@/shared/types";



interface IAuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<IAuthContextType>({} as IAuthContextType);

interface IAuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [isLoading,] = useState(false);
  const [user, setUser] = useState<IUser | null>(() => {
    if (typeof window === "undefined") return null;

    const token = getToken();
    const savedUser = getUser<IUser>();

    if (token && savedUser) {
      return savedUser;
    }

    if (token) {
      try {
        const decoded = jwtDecode<IUser>(token);
        return decoded;
      } catch (error) {
        console.error("Invalid token", error);
        clearAuthData();
        return null;
      }
    }
    return null;
  });

  // Initialize WebSocket when user is authenticated
  useEffect(() => {
    if (user) {
      console.log("🔌 Initializing WebSocket for user:", user.email);
      initSocket();
    } else {
      console.log("🛑 Closing WebSocket - user logged out");
      closeSocket();
    }
  }, [user]);

  const logout = () => {
    AuthService.logout();
    closeSocket();
    setUser(null);
  };

  const updateUser = (newUser: IUser | null) => {
    setUser(newUser);
    if (newUser) {
      saveUser(newUser);
    } else {
      removeUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
