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
        return data;
      } catch (err) {
        console.error("Error fetching product:", err);
        return null;
      }
    };

    const fetchComments = async (productId) => {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      try {
        const [byProductRes, allReviewsRes] = await Promise.all([
          fetch(`${apiUrl}/api/reviews/byProductId/${productId}`),
          fetch(`${apiUrl}/api/reviews`),
        ]);
        const byProduct = await byProductRes.json();
        const allReviews = await allReviewsRes.json();

        const productReviews = Array.isArray(allReviews)
          ? allReviews.filter((r) => r.productId === productId)
          : [];

        const mergedComments = Array.isArray(byProduct)
          ? byProduct.map((comment, index) => ({
              ...comment,
              createdAt: productReviews[index]?.createdAt,
              id: productReviews[index]?.id,
            }))
          : [];

        setComments(mergedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };

    const load = async () => {
      const product = await fetchProduct();
      if (product?.id) {
        await fetchComments(product.id);
      }
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
            {comments.map((comment, index) => {
              const userName = comment.user
                ? `${comment.user.firstname} ${comment.user.lastname}`
                : `User ${comment.userId}`;

              return (
                <div key={index} className={styles.comment}>
                  <img src="/imgs/randomComent.svg" alt={userName} className={styles.commentAvatar} />
                  <div className={styles.commentContent}>
                    <strong>{userName}</strong>
                    {comment.createdAt && (
                      <time className={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString("da-DK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    <p>{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </article>
    </main>
  );
}
