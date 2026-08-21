import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import styles from "./Loginpage.module.scss";

export function Loginpage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Håndter login og signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        navigate("/min-side");
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwordene matcher ikke");
        }
        await signup(formData.firstname, formData.lastname, formData.email, formData.password);
        // Efter signup, login med email for at få token og navigere til min-side
        await login(formData.email, formData.password);
        navigate("/min-side");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{isLogin ? "Log ind" : "Opret bruger"}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isLogin ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="username">Brugernavn</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required disabled={loading} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required disabled={loading} />
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="firstname">Fornavn</label>
                <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required disabled={loading} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastname">Efternavn</label>
                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required disabled={loading} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required disabled={loading} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Bekræft password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
              </div>
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Indlæser..." : isLogin ? "Log ind" : "Opret bruger"}
          </button>
        </form>

        <div className={styles.toggle}>
          <p>{isLogin ? "Har du ikke en bruger?" : "Har du allerede en bruger?"}</p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({
                username: "",
                email: "",
                firstname: "",
                lastname: "",
                password: "",
                confirmPassword: "",
              });
            }}
            className={styles.toggleButton}
          >
            {isLogin ? "Opret bruger her" : "Log ind her"}
          </button>
        </div>
      </div>
    </div>
  );
}
