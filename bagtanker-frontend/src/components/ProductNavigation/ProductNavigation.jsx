import { useFetch } from "../../hooks/useFetch";
import styles from "./ProductNavigation.module.scss";

export function ProductNavigation() {
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
        {categories?.map((category) => (
          <li key={category.id}>{category.title}</li>
        ))}
      </ul>
    </nav>
  );
}
