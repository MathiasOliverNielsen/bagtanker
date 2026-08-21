import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

// Bloker siden hvis bruger allerede er logget ind https://fireship.dev/react-router-protected-routes-authentication
export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/min-side" replace />;
  return children;
}
