import styles from "./Frontpage.module.scss";
import { Header } from "../components/Header/Header.jsx";

export function Frontpage() {
  return (
    <div className={styles.bgImgcontainer}>
      <Header showProductNav={false} />
    </div>
  );
}
