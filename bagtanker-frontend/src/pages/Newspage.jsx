import { Link } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { NewsCard } from "../components/NewsCard/NewsCard";
import styles from "./Newspage.module.scss";

export function Newspage() {
  const { data: allNews, loading } = useFetch("/api/news");

  if (loading) {
    return <main className={styles.pageContainer}>Loading...</main>;
  }

  return (
    <main className={styles.pageContainer}>
      <article className={styles.content}>
        <header className={styles.header}>
          <h1>Nyheder</h1>
        </header>

        <section className={styles.grid}>
          {allNews && allNews.length > 0 ? (
            allNews.map((news) => (
              <Link key={news.id} to={`/news/${news.slug}`} className={styles.newsLink}>
                <NewsCard news={news} />
              </Link>
            ))
          ) : (
            <p>Ingen nyheder fundet</p>
          )}
        </section>
      </article>
    </main>
  );
}
