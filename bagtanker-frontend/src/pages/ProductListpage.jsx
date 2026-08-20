import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { ProductCard } from "../components/ProductCard/ProductCard";
import styles from "./ProductListpage.module.scss";

export function ProductListpage() {
  const { data: productList } = useFetch("/api/products");
  const [products, setProducts] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  // Fetch full details for all products
  useEffect(() => {
    if (!productList) return;

    const fetchAllDetails = async () => {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      const detailsPromises = productList.map((p) =>
        fetch(`${apiUrl}/api/products/${p.slug}`).then((r) => r.json())
      );
      const allDetails = await Promise.all(detailsPromises);
      setProducts(allDetails);
    };

    fetchAllDetails();
  }, [productList]);

  if (!products) return <main className={styles.pageContainer}>Loading...</main>;

  // Sort
  let sorted = [...products];
  if (sortBy === "name") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "likes") {
    sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  const pageTitle = "Produkter";

  return (
    <main className={styles.pageContainer}>
      <article className={styles.content}>
        <header className={styles.header}>
          <h1>{pageTitle}</h1>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortDropdown}>
            <option value="name">Sorter</option>
            <option value="name">Alfabetisk</option>
            <option value="likes">Flest likes</option>
          </select>
        </header>

        <section className={styles.grid}>
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </article>
    </main>
  );
}
