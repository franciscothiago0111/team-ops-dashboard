"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { getToken, removeToken, saveUser, getUser, removeUser, clearAuthData } from "../services/storage.service";
import { initSocket, closeSocket } from "../services/io.service";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    const token = getToken();
    const savedUser = getUser<User>();

    if (token && savedUser) {
      return savedUser;
    }

    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        return decoded;
      } catch (error) {
        console.error("Invalid token", error);
        clearAuthData();
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
    clearAuthData();
    closeSocket();
    setUser(null);
  };

  const updateUser = (newUser: User | null) => {
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
