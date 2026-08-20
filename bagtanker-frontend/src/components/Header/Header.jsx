import { useState } from "react";
import { useLocation } from "react-router";
import { Navigation } from "../Navigation/Navigation";
import styles from "./Header.module.scss";

export function Header({ showProductNav = false, showBackground = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isFrontpage = location.pathname === "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.headerWrapper} ${showBackground ? styles.withBackground : ""} ${isFrontpage ? styles.frontpageHeader : ""}`}>
      <div className={styles.header}>
        <img src="/imgs/Logo.svg" alt="Logo" className={styles.logo} />

        <div className={styles.burgerMenu}>
          <button
            onClick={toggleMenu}
            className={styles.burgerButton}
            aria-label="Menu"
          >
            <img src="/src/assets/bg-imgs/Navigation.svg" alt="Menu" className={styles.burgerIcon} />
          </button>
          <nav className={`${styles.navModal} ${isMenuOpen ? styles.open : ""}`}>
            <button
              onClick={closeMenu}
              className={styles.closeButton}
              aria-label="Luk menu"
            >
              ✕
            </button>
            <Navigation onNavigate={closeMenu} />
          </nav>
        </div>
      </div>
    </header>
  );
}
