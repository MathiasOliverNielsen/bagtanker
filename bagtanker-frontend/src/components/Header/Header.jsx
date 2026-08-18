import { Navigation } from "../Navigation/Navigation";
import { ProductNavigation } from "../ProductNavigation/ProductNavigation";
import styles from "./Header.module.scss";

export function Header({ showProductNav = false, selectedCategory, onSelectCategory }) {
  return (
    <header className={`${styles.headerWrapper} ${showProductNav ? styles.withBackground : ""}`}>
      <div className={styles.header}>
        <img src="/imgs/Logo.svg" alt="Logo" className={styles.logo} />

        <div className={styles.burgerMenu}>
          <img src="/src/assets/bg-imgs/Navigation.svg" alt="Menu" className={styles.burgerIcon} />
          <nav className={styles.navModal}>
            <Navigation />
          </nav>
        </div>
      </div>

      {showProductNav && <ProductNavigation selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />}
    </header>
  );
}
