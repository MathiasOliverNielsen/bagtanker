import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.leftSection}>
        <h3>Bagtanker</h3>
        <ul>
          <li>Øster Uttrupvej 1</li>
          <li>9000 Aalborg</li>
          <li>Tlf: 12345678</li>
          <li>Email: info@bagtanker.dk</li>
        </ul>
      </div>

      <div className={styles.rightSection}>
        <h3>Tilmeld dig Bagtankers nyhedsbrev</h3>
        <p>Få vores nyheder direkte i din indbakke</p>
        <input type="email" placeholder="Indtast email" />
        <button>TILMELD</button>
      </div>
    </footer>
  );
}
