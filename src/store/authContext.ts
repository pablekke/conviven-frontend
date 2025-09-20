import { createContext, useContext } from "react";
import type { LoginRequest } from "../types/api/auth";
import type { User } from "../types/models/user";
import type { AuthSnapshot } from "./authStateManager";

export interface AuthContextValue extends AuthSnapshot {
  login: (credentials: LoginRequest) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
