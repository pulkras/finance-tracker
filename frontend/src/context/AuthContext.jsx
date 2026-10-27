import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { authApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await authApi.getCurrentUser();

      setUser(response.data);

      return response.data;
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        logout();
      }

      throw error;
    }
  }, [logout]);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();

        if (!cancelled) {
          setUser(response.data);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [logout]);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    const userResponse = await authApi.getCurrentUser();

    setUser(userResponse.data);

    return userResponse.data;
  }, []);

  const register = useCallback(async (data) => {
    await authApi.register(data);

    return login({
      username: data.username,
      password: data.password,
    });
  }, [login]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth должен использоваться внутри AuthProvider."
    );
  }

  return context;
}
