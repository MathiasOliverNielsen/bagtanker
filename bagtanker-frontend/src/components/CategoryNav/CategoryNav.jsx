import styles from "./CategoryNav.module.scss";

const CATEGORIES = [
  { id: 1, name: "RUNDSTYKKER", slug: "rundstykker" },
  { id: 2, name: "BAGUETTES", slug: "baguettes" },
  { id: 3, name: "FRANSKBRØD", slug: "franskbroed" },
  { id: 1, name: "RUNDSTYKKER", slug: "rundstykker" },
  { id: 2, name: "BAGUETTES", slug: "baguettes" },
  { id: 3, name: "FRANSKBRØD", slug: "franskbroed" },
  { id: 4, name: "KAGER", slug: "kager" },
  { id: 5, name: "RUGBRØD", slug: "rugbroed" },
];

export function CategoryNav({ selectedCategory, onSelectCategory }) {
  return (
    <nav className={styles.categoryNav}>
      <div className={styles.categories}>
        {CATEGORIES.map((category) => (
          <button key={category.slug} className={`${styles.category} ${selectedCategory === category.slug ? styles.active : ""}`} onClick={() => onSelectCategory(category.slug)}>
            {category.name}
            {selectedCategory === category.slug && <div className={styles.indicator} />}
          </button>
        ))}
      </div>
    </nav>
  );
}
