import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { ProductCard } from "../components/ProductCard/ProductCard";
import styles from "./ProductListpage.module.scss";

const CATEGORY_SLUGS = {
  morgenbroed: ["horn", "håndværker"],
  baguettes: ["baguette", "flutes"],
  franskbroed: ["franskbrød", "franskbroed", "ciabatta"],
  kager: ["kage", "snegle", "birkes", "tebirkes", "chokolade"],
  rugbroed: ["rugbrød", "rugbroed", "grovbrød"],
  grovbroed: ["grovbrød", "grovbroed"],
  boller: ["boller", "snurre"],
};

function getProductCategorySlug(title) {
  const titleLower = title.toLowerCase();
  for (const [slug, keywords] of Object.entries(CATEGORY_SLUGS)) {
    if (keywords.some((kw) => titleLower.includes(kw))) {
      return slug;
    }
  }
  return null;
}

export function ProductListpage() {
  const { data: productList } = useFetch("/api/products");
  const [products, setProducts] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    if (!productList) return;

    const fetchAllDetails = async () => {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      const detailsPromises = productList.map((p) => fetch(`${apiUrl}/api/products/${p.slug}`).then((r) => r.json()));
      const allDetails = await Promise.all(detailsPromises);
      setProducts(allDetails);
    };

    fetchAllDetails();
  }, [productList]);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!selectedCategory) return products;
    return products.filter((p) => getProductCategorySlug(p.title) === selectedCategory);
  }, [products, selectedCategory]);

  const sorted = useMemo(() => {
    let result = [...filtered];
    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "likes") {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return result;
  }, [filtered, sortBy]);

  if (!products) return <main className={styles.pageContainer}>Loading...</main>;

  const pageTitle = "Produkter";

  return (
    <main className={styles.pageContainer}>
      <article className={styles.content}>
        <header className={styles.header}>
          <h1>{pageTitle}</h1>
        </header>

        <div className={styles.sortWrapper}>
          <label htmlFor="sort-dropdown">Sortering:</label>
          <select id="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortDropdown}>
            <option value="name">Alfabetisk</option>
            <option value="likes">Flest likes</option>
          </select>
        </div>

        <section className={styles.grid}>{sorted.length > 0 ? sorted.map((product) => <ProductCard key={product.id} product={product} />) : <p>Ingen produkter fundet i denne kategori.</p>}</section>
      </article>
    </main>
  );
}
