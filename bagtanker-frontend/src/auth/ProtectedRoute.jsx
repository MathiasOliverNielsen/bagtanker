import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

// Bloker siden hvis bruger ikke er logget ind https://fireship.dev/react-router-protected-routes-authentication
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
