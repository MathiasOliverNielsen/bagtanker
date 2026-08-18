import { useState } from "react";
import { useOutletContext } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { ProductCard } from "../components/ProductCard/ProductCard";
import styles from "./ProductListpage.module.scss";

const normalize = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
};

export function ProductListpage() {
  const { data: categories } = useFetch("/api/categories");
  const { data: apiProducts } = useFetch("/api/products");
  const { selectedCategory } = useOutletContext();
  const [sortBy, setSortBy] = useState("name");

  const currentCategory = categories?.find((c) => c.slug === selectedCategory);

  const allApiProducts = apiProducts?.filter((p) => p.title !== "Håndværker") || [];

  const normalizedCategoryName = normalize(currentCategory?.title || "");
  const filteredProducts = allApiProducts.filter((p) =>
    normalize(p.title).includes(normalizedCategoryName)
  ) || [];

  let sortedProducts = [...filteredProducts];
  if (sortBy === "name") {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "likes") {
    sortedProducts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  const categoryName = currentCategory?.title || "Produkter";

  return (
    <main className={styles.pageContainer}>
      <article className={styles.content}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}></nav>

        <header className={styles.header}>
          <h1>{categoryName}</h1>
          <select id="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortDropdown} aria-label="Sorter produkter">
            <option value="name">Sorter</option>
            <option value="name">Alfabetisk</option>
            <option value="likes">Flest likes</option>
          </select>
        </header>

        <section className={styles.grid} aria-label="Produkter">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </article>
    </main>
  );
}
