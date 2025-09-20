import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { LoginRequest } from "../types/api/auth";
import { AuthStateManager, type AuthSnapshot } from "./authStateManager";
import { AuthContext, type AuthContextValue } from "./authContext";

// Context y hook movidos a src/store/authContext.ts para cumplir con Fast Refresh

export function AuthProvider({ children }: { children: ReactNode }) {
  const managerRef = useRef<AuthStateManager | null>(null);
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(() => {
    const instance = new AuthStateManager();
    managerRef.current = instance;
    return instance.getState();
  });

  useEffect(() => {
    // Crear y suscribir en un único ciclo; limpiar siempre dispone la instancia usada.
    const instance = managerRef.current ?? new AuthStateManager();
    managerRef.current = instance;
    const unsubscribe = instance.subscribe(setSnapshot);

    return () => {
      unsubscribe();
      instance.dispose();
      managerRef.current = null;
    };
  }, []);

  const login = useCallback((credentials: LoginRequest) => {
    const instance = managerRef.current ?? new AuthStateManager();
    managerRef.current = instance;
    return instance.login(credentials);
  }, []);

  const logout = useCallback(() => {
    const instance = managerRef.current;
    if (instance) instance.logout();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...snapshot,
      login,
      logout,
    }),
    [login, logout, snapshot]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export type { AuthStatus } from "./authStateManager";
