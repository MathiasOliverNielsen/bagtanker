import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "./authApi";

// Håndterer login/logout og holder styr på hvem der er logget ind
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Vent med at sende brugeren væk til efter vi har tjekket om brugeren er logget ind
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // vent med login ved app start hvis vores token allerede findes
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      setLoading(false);
      return;
    }

    authApi.verify(token).then((valid) => {
      if (valid) {
        setUser(JSON.parse(stored));
      } else {
        logout();
      }
      setLoading(false);
    });
  }, []);

  async function login(username, password) {
    setError(null);
    const { accessToken, refreshToken, user } = await authApi.login(username, password);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  async function signup(firstname, lastname, email, password) {
    setError(null);
    await authApi.signup(firstname, lastname, email, password);
  }

  function logout() {
    ["accessToken", "refreshToken", "user"].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        setError,
        login,
        signup,
        logout,
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
