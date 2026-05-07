"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User } from "@/types/api/auth";
import { parseJwt, isTokenExpired, getUserFromPayload } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const entry = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    if (entry) {
      const token = entry.split("=")[1];
      if (token && !isTokenExpired(token)) {
        const payload = parseJwt(token);
        if (payload) {
          const restored = getUserFromPayload(payload);
          if (restored) setUser(restored);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // TODO: call /auth/logout when backend is ready
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
