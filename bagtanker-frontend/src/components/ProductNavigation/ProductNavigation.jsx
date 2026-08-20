import { useSearchParams, Link } from "react-router";
import styles from "./ProductNavigation.module.scss";

const CATEGORIES = [
  { slug: "morgenbroed", name: "Morgenbrød" },
  { slug: "baguettes", name: "Baguettes" },
  { slug: "franskbroed", name: "Franskbrød" },
  { slug: "kager", name: "Kager" },
  { slug: "rugbroed", name: "Rugbrød" },
];

export function ProductNavigation() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  return (
    <nav className={styles.productNav}>
      <div className={styles.categories}>
        <Link
          to="/products"
          className={`${styles.category} ${!selectedCategory ? styles.active : ""}`}
        >
          Alle kategorier
        </Link>

        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/products?category=${category.slug}`}
            className={`${styles.category} ${
              selectedCategory === category.slug ? styles.active : ""
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
