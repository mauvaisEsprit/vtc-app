// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "../src/components/i18n";
import "./styles/Index.css";
import ScrollToTopButton from "../src/components/ScrollToTopButton";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

// Страницы
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Tarifs from "./pages/Tarifs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueDeConfidentialite from "./pages/PolitiqueDeConfidentialite";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
export default function App() {
 const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("seo.title");
    
    const description = t("seo.description");
    let metaDescription = document.querySelector("meta[name='description']");
    
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
  }, [i18n.language, t]);

  return (
    <Router basename="/">
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueDeConfidentialite />} />

         <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/login/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ScrollToTopButton />
      <Footer />
    </Router>
  );
}
