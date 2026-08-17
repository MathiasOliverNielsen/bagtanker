import { useLocation } from "react-router";
import { Header } from "../components/Header/Header";
import { Outlet } from "react-router";

export function MainLayout() {
  const location = useLocation();
  const isFrontpage = location.pathname === "/";

  return (
    <>
      <Header showProductNav={!isFrontpage} />
      <Outlet />
    </>
  );
}
