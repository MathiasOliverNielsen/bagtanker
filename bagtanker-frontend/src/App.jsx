import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { Frontpage } from "./pages/Frontpage";
import { Contactpage } from "./pages/Contactpage";
import { Loginpage } from "./pages/Loginpage";
import { MinSidepage } from "./pages/MinSidepage";
import { Newspage } from "./pages/Newspage";
import { NewsDetailspage } from "./pages/NewsDetailspage";
import { ProductListpage } from "./pages/ProductListpage";
import { ProductDetailspage } from "./pages/ProductDetailspage";
import { Navigation } from "./components/Navigation/Navigation";
import { MainLayout } from "./layout/MainLayout";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { GuestRoute } from "./auth/GuestRoute";
import "./index.scss";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Frontpage />} />
            <Route path="/contact" element={<Contactpage />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Loginpage />
                </GuestRoute>
              }
            />
            <Route
              path="/min-side"
              element={
                <ProtectedRoute>
                  <MinSidepage />
                </ProtectedRoute>
              }
            />
            <Route path="/news" element={<Newspage />} />
            <Route path="/news/:id" element={<NewsDetailspage />} />
            <Route path="/products" element={<ProductListpage />} />
            <Route path="/products/:id" element={<ProductDetailspage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
