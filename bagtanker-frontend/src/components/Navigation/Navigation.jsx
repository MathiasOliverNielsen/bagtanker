import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";

export function Navigation({ onNavigate }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  // Log ud
  const handleLogout = () => {
    logout();
    navigate("/");
    handleClick();
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" onClick={handleClick}>Forside</NavLink>
        </li>
        <li>
          <NavLink to="/products" onClick={handleClick}>Produkter</NavLink>
        </li>
        <li>
          <NavLink to="/news" onClick={handleClick}>Nyheder</NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={handleClick}>Kontakt</NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/min-side" onClick={handleClick}>Min side</NavLink>
            </li>
            <li>
              <button onClick={handleLogout} style={{ background: "none", border: "none", color: "white", cursor: "pointer", textDecoration: "none" }}>
                Log ud
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" onClick={handleClick}>Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
