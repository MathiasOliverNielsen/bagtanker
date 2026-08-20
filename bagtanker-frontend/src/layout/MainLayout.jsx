import { useLocation } from "react-router";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Outlet } from "react-router";

export function MainLayout() {
  const location = useLocation();
  const isFrontpage = location.pathname === "/";

  return (
    <>
      {!isFrontpage && <Header showProductNav={!isFrontpage} />}
      <Outlet />
      {!isFrontpage && <Footer />}
    </>
  );
}
