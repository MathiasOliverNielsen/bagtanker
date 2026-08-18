import styles from "./NewsCard.module.scss";

export function NewsCard({ news }) {
  const imageUrl = `${import.meta.env.VITE_API_URL}${news.imageUrl}`;

  return (
    <div className={styles.card} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={styles.content}>
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
