import { useState } from "react";
import { useLocation } from "react-router";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Outlet } from "react-router";

export function MainLayout() {
  const location = useLocation();
  const isFrontpage = location.pathname === "/";
  const [selectedCategory, setSelectedCategory] = useState("rundstykker");

  return (
    <>
      {!isFrontpage && <Header showProductNav={!isFrontpage} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />}
      <Outlet context={{ selectedCategory }} />
      {!isFrontpage && <Footer />}
    </>
  );
}
