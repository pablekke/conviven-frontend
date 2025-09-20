import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../store/authContext";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "authenticating") {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-secondary">
        Verificando sesión...
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
