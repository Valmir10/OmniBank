"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api } from "@/services/api";
import { User, AuthResponse } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, name: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  verifyIdentity: () => Promise<{ verified: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("omnibank_token");
    const user = localStorage.getItem("omnibank_user");
    if (token && user) {
      setState({ token, user: JSON.parse(user), isLoading: false });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const setAuth = useCallback((token: string, user: User) => {
    localStorage.setItem("omnibank_token", token);
    localStorage.setItem("omnibank_user", JSON.stringify(user));
    setState({ token, user, isLoading: false });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<AuthResponse>("/auth/login", { email, password });
      if (res.error) return { error: res.error };
      setAuth(res.data!.token, res.data!.user);
      return {};
    },
    [setAuth]
  );

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      const res = await api.post<AuthResponse>("/auth/register", {
        email,
        name,
        password,
      });
      if (res.error) return { error: res.error };
      setAuth(res.data!.token, res.data!.user);
      return {};
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("omnibank_token");
    localStorage.removeItem("omnibank_user");
    setState({ user: null, token: null, isLoading: false });
  }, []);

  const verifyIdentity = useCallback(async () => {
    const res = await api.post<{ verified: boolean; message: string }>(
      "/auth/verify",
      {}
    );
    if (res.error) return { verified: false, message: res.error };
    if (res.data?.verified) {
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, isVerified: true } : null,
      }));
      const storedUser = localStorage.getItem("omnibank_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.isVerified = true;
        localStorage.setItem("omnibank_user", JSON.stringify(user));
      }
    }
    return res.data!;
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await api.get<{ user: User }>("/auth/me");
    if (res.data) {
      setState((s) => ({ ...s, user: res.data!.user }));
      localStorage.setItem("omnibank_user", JSON.stringify(res.data.user));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, verifyIdentity, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
