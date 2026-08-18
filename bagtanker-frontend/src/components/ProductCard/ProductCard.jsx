import { useState } from "react";
import styles from "./ProductCard.module.scss";

export function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    // TODO:  mby Call API to update likes
    // await fetch(`/api/products/${product.id}/like`, { method: "POST" });
  };

  const imageUrl = `${import.meta.env.VITE_PUBLIC_API_URL}${product.imageUrl}`;

  return (
    <article className={styles.productCard}>
      <img src={imageUrl} alt={product.title} className={styles.image} />

      <div className={styles.info}>
        <h2 className={styles.title}>{product.title}</h2>
        <p className={styles.description}>{product.description || `Pris: ${product.price}kr`}</p>

        <footer className={styles.footer}>
          <button className={styles.button} aria-label={`Læs mere om ${product.title}`}>
            Læs mere
          </button>
          <div className={styles.likes} aria-label={`${product.likes || 0} likes`}>
            <span>{product.likes || 0}</span>
            <button className={`${styles.heart} ${liked ? styles.liked : ""}`} onClick={handleLike} aria-label={`Like ${product.title}`}>
              ♡
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
