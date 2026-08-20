import { useState } from "react";
import { Link } from "react-router";
import { useFetch } from "../../hooks/useFetch";
import styles from "./NewsSlider.module.scss";
import BreadImageOne from "../../assets/bg-imgs/BreadImageOne.png";
import BreadImageTwo from "../../assets/bg-imgs/BreadImageTwo.png";
import BreadImageThree from "../../assets/bg-imgs/BreadImageThree.png";
import BreadImageFour from "../../assets/bg-imgs/BreadImageFour.png";

const BG_IMAGES = [BreadImageOne, BreadImageTwo, BreadImageThree, BreadImageFour];

export function NewsSlider() {
  const { data: allNews } = useFetch("/api/news");
  const [currentSlide, setCurrentSlide] = useState(0);

  const getNewsForSlide = (slideIndex) => {
    if (!allNews || allNews.length === 0) return [];
    const startIndex = (slideIndex * 3) % allNews.length;
    const newsItems = [];
    for (let i = 0; i < 3; i++) {
      newsItems.push(allNews[(startIndex + i) % allNews.length]);
    }
    return newsItems;
  };

  const currentNews = getNewsForSlide(currentSlide);
  const bgImage = BG_IMAGES[currentSlide % BG_IMAGES.length];

  return (
    <div className={styles.sliderContainer} style={{ backgroundImage: `url(${bgImage})` }}>
      <h2 className={styles.sliderTitle}>Nyheder</h2>

      <div className={styles.contentWrapper}>
        <div className={styles.newsCards}>
          {currentNews.map((news) => (
            <Link key={news.id} to={`/news/${news.slug}`} className={styles.newsCard}>
              <img src={`${import.meta.env.VITE_PUBLIC_API_URL}${news.imageUrl}`} alt={news.title} className={styles.newsImage} />
              <div className={styles.newsContent}>
                <h3>{news.title}</h3>
                <p>{news.teaser}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {BG_IMAGES.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentSlide === index ? styles.active : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
