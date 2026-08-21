import { useParams } from "react-router";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAuthHeader } from "../auth/authApi";
import styles from "./ProductDetailspage.module.scss";

export function ProductDetailspage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

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

    // Henter kommentarer fra 2 endpoints og fusionerer dataene fordi database ikke returnerer createdAt og id i byProductId endpoint
    const fetchComments = async (productId) => {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      try {
        const [byProductRes, allReviewsRes] = await Promise.all([fetch(`${apiUrl}/api/reviews/byProductId/${productId}`), fetch(`${apiUrl}/api/reviews`)]);
        const byProduct = await byProductRes.json();
        const allReviews = await allReviewsRes.json();

        const productReviews = Array.isArray(allReviews) ? allReviews.filter((r) => r.productId === productId) : [];

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

  // Indsend ny kommentar
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;

    try {
      const res = await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          title: product.title,
          comment: commentText,
          numStars: rating,
          productId: product.id,
          isActive: true,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Kunne ikke indsende kommentar");
      }

      const newComment = await res.json();
      setComments([...comments, { ...newComment, user: { firstname: user.firstname, lastname: user.lastname } }]);
      setCommentText("");
      setRating(5);
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Rediger kommentar
  const handleEditComment = async (id, newText) => {
    if (!newText.trim()) return;

    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
    try {
      const res = await fetch(`${apiUrl}/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          title: comment.title,
          comment: newText,
          numStars: comment.numStars,
          productId: comment.productId,
          isActive: comment.isActive,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Kunne ikke opdatere kommentar");
      }

      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, comment: newText } : c)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // Slet kommentar
  const handleDeleteComment = async (id) => {
    if (!confirm("Er du sikker?")) return;

    const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
    try {
      const res = await fetch(`${apiUrl}/api/reviews/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!res.ok) throw new Error("Kunne ikke slette kommentar");

      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

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

          {isAuthenticated ? (
            <form className={styles.commentForm} onSubmit={handleSubmitComment}>
              <h3>Skriv en kommentar</h3>
              <div className={styles.formGroup}>
                <label htmlFor="rating">Vurdering (1-5 stjerner)</label>
                <select id="rating" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} disabled={submitting}>
                  <option value="1">1 stjerne</option>
                  <option value="2">2 stjerner</option>
                  <option value="3">3 stjerner</option>
                  <option value="4">4 stjerner</option>
                  <option value="5">5 stjerner</option>
                </select>
              </div>
              <textarea placeholder="Din kommentar..." rows="5" required value={commentText} onChange={(e) => setCommentText(e.target.value)} disabled={submitting}></textarea>
              <button type="submit" disabled={submitting}>
                {submitting ? "Indlæser..." : "Indsend kommentar"}
              </button>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Du skal være logget ind for at lave kommentarer</p>
              <Link to="/login">Log ind her</Link>
            </div>
          )}

          <div className={styles.commentsList}>
            {comments.map((comment) => {
              const userName = comment.user ? `${comment.user.firstname} ${comment.user.lastname}` : `User ${comment.userId}`;
              const isOwnComment = user?.id === comment.userId;

              return (
                <div key={comment.id} className={styles.comment}>
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
                    {editingId === comment.id ? (
                      <div className={styles.editForm}>
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows="3" />
                        <div className={styles.editActions}>
                          <button onClick={() => handleEditComment(comment.id, editText)} className={styles.saveButton}>
                            Gem
                          </button>
                          <button onClick={() => setEditingId(null)} className={styles.cancelButton}>
                            Annuller
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>{comment.comment}</p>
                        {isOwnComment && (
                          <div className={styles.actions}>
                            <button
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditText(comment.comment);
                              }}
                              className={styles.editButton}
                            >
                              Rediger
                            </button>
                            <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteButton}>
                              Slet
                            </button>
                          </div>
                        )}
                      </>
                    )}
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
