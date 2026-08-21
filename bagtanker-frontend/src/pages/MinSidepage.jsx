import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAuthHeader } from "../auth/authApi";
import styles from "./MinSidepage.module.scss";

export function MinSidepage() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserComments();
  }, []);

  // Hent kun brugerens egne kommentarer fandt det her https://www.robinwieruch.de/react-data-fetching-patterns/
  async function fetchUserComments() {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/reviews`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Kunne ikke hente kommentarer");

      const allComments = await res.json();
      const userComments = allComments.filter((comment) => comment.user?.id === user?.id || comment.userId === user?.id);
      setComments(userComments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id, newComment) {
    if (!newComment.trim()) {
      setError("Kommentar kan ikke være tom");
      return;
    }

    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    try {
      const res = await fetch(`${apiUrl}/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          title: comment.title || "",
          comment: newComment,
          numStars: comment.numStars || 5,
          productId: comment.productId || "",
          isActive: comment.isActive !== false,
        }),
      });

      if (!res.ok) throw new Error("Kunne ikke opdatere kommentar");

      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, comment: newComment } : c)));
      setEditingId(null);
      setEditText("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Er du sikker på at du vil slette denne kommentar?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/reviews/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!res.ok) throw new Error("Kunne ikke slette kommentar");

      setComments((prev) => prev.filter((c) => c.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Min side</h1>
      <p className={styles.welcome}>
        Velkommen, {user?.firstname} {user?.lastname}
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.commentsSection}>
        <h2>Mine kommentarer</h2>

        {loading ? (
          <p>Indlæser...</p>
        ) : comments.length === 0 ? (
          <p className={styles.empty}>Du har ikke lavet nogen kommentarer endnu</p>
        ) : (
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <h3>{comment.productTitle || "Produkt"}</h3>
                  <span className={styles.date}>{new Date(comment.createdAt).toLocaleDateString("da-DK")}</span>
                </div>

                {editingId === comment.id ? (
                  <div className={styles.editForm}>
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows="4" />
                    <div className={styles.editActions}>
                      <button onClick={() => handleUpdate(comment.id, editText)} className={styles.saveButton}>
                        Gem
                      </button>
                      <button onClick={() => setEditingId(null)} className={styles.cancelButton}>
                        Annuller
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.commentText}>{comment.comment}</p>
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
                      <button onClick={() => handleDelete(comment.id)} className={styles.deleteButton}>
                        Slet
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
