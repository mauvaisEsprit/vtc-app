// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroImage from './components/HeroImage';
import Footer from './components/Footer';
import './styles/Index.css';

// Страницы
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Tarifs from './pages/Tarifs';
import BookingForm from './components/BookingForm';

export default function App() {
  return (
    <Router>
      <Header />
      <HeroImage />
      
      
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tarifs" element={<Tarifs />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}
