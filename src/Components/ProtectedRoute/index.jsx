import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../Store/authStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
