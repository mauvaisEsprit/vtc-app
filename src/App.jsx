// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/Index.css";

// Страницы
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Tarifs from "./pages/Tarifs";

export default function App() {
  return (
    <BrowserRouter basename="/vtc-app/">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tarifs" element={<Tarifs />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
