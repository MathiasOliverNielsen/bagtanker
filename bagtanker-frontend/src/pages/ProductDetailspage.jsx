import { useParams } from "react-router";
import { useState, useEffect } from "react";
import styles from "./ProductDetailspage.module.scss";

export function ProductDetailspage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      try {
        const res = await fetch(`${apiUrl}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    const fetchComments = async () => {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      try {
        const res = await fetch(`${apiUrl}/api/products/${id}/comments`);
        const data = await res.json();
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const load = async () => {
      await fetchProduct();
      await fetchComments();
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <main className={styles.pageContainer}>Loading...</main>;
  if (!product) return <main className={styles.pageContainer}>Produkt ikke fundet</main>;

  return (
    <main className={styles.pageContainer}>
      <article className={styles.content}>
        <h1 className={styles.pageTitle}>{product.title}</h1>

        <div className={styles.topSection}>
          <section className={styles.productSection}>
            <img src={`${import.meta.env.VITE_PUBLIC_API_URL}${product.imageUrl}`} alt={product.title} className={styles.image} />

            <div className={styles.info}>
              <p className={styles.description}>{product.description}</p>
              <p className={styles.price}>
                <strong>Pris:</strong> {product.price.toFixed(2).replace(".", ",")} DKK
              </p>
            </div>
          </section>

          {product.procedure && (
            <section className={styles.procedure}>
              <h3>Fremgangsmåde</h3>
              <p>{product.procedure}</p>
            </section>
          )}

          {product.procedure && (
            <section className={styles.recipe}>
              <div className={styles.recipeHeader}>
                <h2>Opskrift</h2>
                <div className={styles.likes}>
                  <span>{product.likes || 0}</span>
                  <span className={styles.likeIcon}>♡</span>
                </div>
              </div>

              <div className={styles.columnsWrapper}>
                <div className={styles.column}>
                  <h4>Varighed</h4>
                  <p>{product.durationInMinutes} min</p>
                </div>
                <div className={styles.column}>
                  <h4>Antal</h4>
                  <p>{product.amount}</p>
                </div>
                <div className={styles.column}>
                  <h4>Ingredienser</h4>
                  <ul>
                    {product.productIngredients?.map((ing) => (
                      <li key={ing.id}>
                        {ing.amount} {ing.units?.abbreviation} {ing.ingredients?.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>

        <section className={styles.comments}>
          <h2>Kommentarer ({comments.length})</h2>

          <form className={styles.commentForm} onSubmit={(e) => e.preventDefault()}>
            <h3>Skriv en kommentar</h3>
            <input type="text" placeholder="Dit navn" required />
            <textarea placeholder="Din kommentar..." rows="5" required></textarea>
            <button type="submit">Indsend kommentar</button>
          </form>

          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <strong>{comment.name}</strong>
                <p>{comment.text}r</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
