import { Link } from "react-router";
import styles from "./ProductCard.module.scss";

export function ProductCard({ product }) {
  return (
    <article className={styles.productCard}>
      <img
        src={`${import.meta.env.VITE_PUBLIC_API_URL}${product.imageUrl}`}
        alt={product.title}
        className={styles.image}
      />
      <div className={styles.info}>
        <h2 className={styles.title}>{product.title}</h2>
        <p className={styles.description}>{product.description}</p>
        <footer className={styles.footer}>
          <Link to={`/products/${product.slug}`} className={styles.button}>Læs mere</Link>
          <button className={styles.heart}>♡</button>
        </footer>
      </div>
    </article>
  );
}
