import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authStorage } from "../lib/auth-storage";

interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-app.replit.app";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await authStorage.getToken();
      if (token) {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          await authStorage.setUser(userData);
        } else {
          await authStorage.clear();
        }
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      await authStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(token: string) {
    await authStorage.setToken(token);
    await loadUser();
  }

  async function signOut() {
    await authStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
