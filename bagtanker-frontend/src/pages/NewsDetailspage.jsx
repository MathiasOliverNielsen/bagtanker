import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import styles from "./NewsDetailspage.module.scss";

export function NewsDetailspage() {
  const { id: slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newsWithDates, setNewsWithDates] = useState([]);
  const { data: allNews } = useFetch("/api/news");

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/news/${slug}`);
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!allNews || allNews.length === 0) return;

    const fetchNewsDetails = async () => {
      try {
        const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
        const detailsPromises = allNews.map((news) =>
          fetch(`${apiUrl}/api/news/${news.slug}`).then((r) => r.json())
        );
        const allDetails = await Promise.all(detailsPromises);
        setNewsWithDates(allDetails);
      } catch (error) {
        console.error("Error fetching news details:", error);
        setNewsWithDates(allNews);
      }
    };

    fetchNewsDetails();
  }, [allNews]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${import.meta.env.VITE_PUBLIC_API_URL}${imagePath}`;
  };

  if (loading) {
    return <main className={styles.pageContainer}>Loading...</main>;
  }

  if (!article) {
    return <main className={styles.pageContainer}>Artikel ikke fundet</main>;
  }

  return (
    <main className={styles.pageContainer}>
      <article className={styles.articleContainer}>
        <div className={styles.articleContent}>
          <header className={styles.articleHeader}>
            <h1>{article.title}</h1>
            <time dateTime={article.createdAt}>
              {new Date(article.createdAt).toLocaleDateString("da-DK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          {(article.image || article.imageUrl) && (
            <img src={getImageUrl(article.image || article.imageUrl)} alt={article.title} className={styles.featuredImage} />
          )}

          <div className={styles.articleBody}>
            {article.content}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.relatedNews}>
            <header className={styles.newsHeader}>
              <h2>Se også</h2>
            </header>
            <ul className={styles.newsList}>
              {newsWithDates.map((newsItem) => (
                <li
                  key={newsItem.id}
                  className={newsItem.id === article.id ? styles.current : ""}
                >
                  <Link to={`/news/${newsItem.slug}`} className={styles.newsLink}>
                    <div className={styles.newsDate}>
                      {new Date(newsItem.createdAt).toLocaleDateString("da-DK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className={styles.newsTitle}>{newsItem.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </article>
    </main>
  );
}
