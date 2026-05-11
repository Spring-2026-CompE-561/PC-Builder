"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getToken, clearToken, setToken } from "@/lib/auth";
import { api } from "@/lib/api";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
    deleteAccount: () => Promise<void>;

}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api
        .get<User>("/auth/me")
        .then((data) => setUser(data))
        .catch(() => clearToken())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    setToken(token);
    const data = await api.get<User>("/auth/me");
    setUser(data);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const deleteAccount = async () => {
    await api.delete("/auth/me");
    clearToken();
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}