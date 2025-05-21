// App.jsx
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "../src/components/i18n";
import "./styles/Index.css";
import ScrollToTopButton from "../src/components/ScrollToTopButton";

// Страницы
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Tarifs from "./pages/Tarifs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Support from "./pages/Support";

export default function App() {
  return (
    <HashRouter basename="/">
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
      </Routes>
      <ScrollToTopButton />
      <Footer />
    </HashRouter>
  );
}
