import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { getApiUrl } from "../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  checkAuth: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const API_URL = getApiUrl();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchCsrfToken = async () => {
    const response = await fetch(`${API_URL}/api/csrf-token`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to retrieve CSRF token.");
    }
    return data.csrfToken;
  };

  const logout = useCallback(async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      });
    } catch {
      // Logout even if the request fails
    }
    setUser(null);
    window.location.href = "/login";
  }, [API_URL]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
