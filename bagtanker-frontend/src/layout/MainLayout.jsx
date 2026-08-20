import { useLocation } from "react-router";
import { Header } from "../components/Header/Header";
import { ProductNavigation } from "../components/ProductNavigation/ProductNavigation";
import { Footer } from "../components/Footer/Footer";
import { Outlet } from "react-router";

export function MainLayout() {
  const location = useLocation();
  const isFrontpage = location.pathname === "/";
  const isProductPage = location.pathname === "/products" || location.pathname.startsWith("/products/");

  return (
    <>
      {!isFrontpage && <Header showProductNav={isProductPage} showBackground={true} />}
      {!isFrontpage && <ProductNavigation />}
      <Outlet />
      {!isFrontpage && <Footer />}
    </>
  );
}
