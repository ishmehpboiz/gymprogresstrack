"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSession, login as authLogin, logout as authLogout, signup as authSignup } from "@/lib/auth";
import type { AuthSession, AuthUser, LoginInput, SignupInput } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => ReturnType<typeof authLogin>;
  signup: (input: SignupInput) => ReturnType<typeof authSignup>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setIsLoading(false);
  }, []);

  const login = useCallback((input: LoginInput) => {
    const result = authLogin(input);
    if (result.success) setSession(getSession());
    return result;
  }, []);

  const signup = useCallback((input: SignupInput) => {
    const result = authSignup(input);
    if (result.success) setSession(getSession());
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isLoading,
      isAuthenticated: !!session?.user,
      login,
      signup,
      logout,
    }),
    [session, isLoading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
