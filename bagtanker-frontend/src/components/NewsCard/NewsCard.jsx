import styles from "./NewsCard.module.scss";

export function NewsCard({ news }) {
  const imageUrl = `${import.meta.env.VITE_PUBLIC_API_URL}${news.imageUrl}`;

  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={news.title} className={styles.image} />
      <div className={styles.content}>
        {news.createdAt && (
          <time className={styles.date}>
            {new Date(news.createdAt).toLocaleDateString("da-DK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        )}
        <h4>{news.title}</h4>
        <p className={styles.teaser}>{news.teaser}</p>
        {news.labels && (
          <div className={styles.labels}>
            {news.labels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
