import { useState } from "react";
import styles from "./Footer.module.scss";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Indtast venligst en email adresse");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Indtast venligst en gyldig email adresse");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
      console.log("Subscribing to newsletter with email:", email);

      const response = await fetch(`${apiUrl}/api/newsletters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (response.ok) {
        setStatus("success");
        setMessage("Tak for tilmeldingen! Tjek din email for bekræftelse.");
        setEmail("");
        setTimeout(() => {
          setStatus(null);
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage("Der opstod en fejl. Prøv igen senere.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setMessage("Der opstod en fejl. Prøv igen senere.");
    }
  };

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
        <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Indtast email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "TILMELDER..." : "TILMELD"}
          </button>
        </form>
        {message && (
          <div className={`${styles.message} ${styles[status]}`}>
            {message}
          </div>
        )}
      </div>
    </footer>
  );
}
