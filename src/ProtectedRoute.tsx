import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Bypass authentication if environment variable is set
  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
