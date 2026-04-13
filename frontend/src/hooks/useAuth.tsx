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

function generateId(): string {
  return crypto.randomUUID();
}

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

// Demo-mode fallback when backend is unavailable
function createDemoUser(email: string, name: string): { token: string; user: User } {
  const user: User = {
    id: generateId(),
    email,
    name,
    isVerified: false,
  };
  return { token: `demo_${generateId()}`, user };
}

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
      if (res.error) {
        // Demo mode: check localStorage for registered demo users
        const demoUsers = JSON.parse(localStorage.getItem("omnibank_demo_users") || "[]");
        const found = demoUsers.find((u: { email: string; password: string }) => u.email === email && u.password === password);
        if (found) {
          setAuth(found.token, found.user);
          return {};
        }
        // If backend error is network-related, allow demo login
        if (res.error === "Network error - please try again") {
          return { error: "No account found. Create one first." };
        }
        return { error: res.error };
      }
      setAuth(res.data!.token, res.data!.user);
      return {};
    },
    [setAuth]
  );

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      const res = await api.post<AuthResponse>("/auth/register", { email, name, password });
      if (res.error) {
        // Demo mode fallback: create user locally
        if (res.error === "Network error - please try again") {
          const demo = createDemoUser(email, name);
          // Store demo user for login
          const demoUsers = JSON.parse(localStorage.getItem("omnibank_demo_users") || "[]");
          demoUsers.push({ email, password, token: demo.token, user: demo.user });
          localStorage.setItem("omnibank_demo_users", JSON.stringify(demoUsers));
          setAuth(demo.token, demo.user);
          return {};
        }
        return { error: res.error };
      }
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
    const res = await api.post<{ verified: boolean; message: string }>("/auth/verify", {});
    if (res.error) {
      // Demo mode: auto-verify
      if (res.error === "Network error - please try again") {
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
        return { verified: true, message: "Identity verified successfully via simulated KYC/AML process" };
      }
      return { verified: false, message: res.error };
    }
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
