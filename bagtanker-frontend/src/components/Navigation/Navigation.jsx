import { NavLink } from "react-router";

export function Navigation({ onNavigate }) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
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
        <li>
          <NavLink to="/login" onClick={handleClick}>Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}
