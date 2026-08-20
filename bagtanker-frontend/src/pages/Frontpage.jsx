import { Header } from "../components/Header/Header.jsx";
import { NewsSlider } from "../components/NewsSlider/NewsSlider";

export function Frontpage() {
  return (
    <div style={{ position: "relative" }}>
      <Header showProductNav={false} />
      <NewsSlider />
    </div>
  );
}
