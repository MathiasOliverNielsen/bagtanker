import { useFetch } from "../../hooks/useFetch";
import styles from "./ProductNavigation.module.scss";

export function ProductNavigation({ selectedCategory, onSelectCategory }) {
  const { data: categories, loading, error } = useFetch("/api/categories");

  if (loading) {
    return (
      <nav className={styles.productNav}>
        <p>Loading...</p>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className={styles.productNav}>
        <p>Error: {error}</p>
      </nav>
    );
  }

  return (
    <nav className={styles.productNav}>
      <ul>
        {categories?.slice(0, 5).map((category) => (
          <li
            key={category.id}
            className={selectedCategory === category.slug ? styles.active : ""}
            onClick={() => onSelectCategory && onSelectCategory(category.slug)}
          >
            {category.title}
          </li>
        ))}
      </ul>
    </nav>
  );
}
