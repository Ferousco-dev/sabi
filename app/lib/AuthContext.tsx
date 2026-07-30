"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, Role } from "./auth";
import { getMe, getToken, setToken, clearToken, logout as apiLogout } from "./auth";
import { clearResourceCache } from "./useResource";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateRole: (role: Role) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) { setUser(null); setLoading(false); return; }
    const res = await getMe();
    if (res.ok && res.data && res.data.success) {
      setUser(res.data.user);
    } else {
      clearToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = (token: string, u: User) => {
    setToken(token);
    setUser(u);
  };

  const logout = async () => {
    await apiLogout();
    clearResourceCache(); // never leak one user's cached data into the next session
    setUser(null);
  };

  const updateRole = (role: Role) => {
    setUser((prev) => prev ? { ...prev, role } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
