"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { User } from "@prisma/client";
import { PublicUser } from "./api/auth/me/route";

type AuthContextType = {
  user: Omit<User, "password"> | null;
  setUser: React.Dispatch<React.SetStateAction<Omit<User, "password"> | null>>;
  logout: () => Promise<void>;
  recheckAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = (await response.json()) as { user: PublicUser };
        setUser(data.user);
      } else {
        // If the response is not ok, assume the user is not authenticated
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // In case of an error, we also set the user to null
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const recheckAuth = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, recheckAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
