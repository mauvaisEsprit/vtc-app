import React, { useState } from 'react';
import { NavLink as Link } from 'react-router-dom';
import '../styles/Nav.css';

const Nav = () => {
  const [lang, setLang] = useState('EN');
  const [navOpen, setNavOpen] = useState(false);

  const toggleLang = () => {
    setLang(prev => (prev === 'FR' ? 'EN' : 'FR'));
  };

  return (
    <nav className="nav">
      <div className={`nav ${navOpen ? 'open' : ''}`}>
        <div className="nav-item"><Link to="/aboutus">About Us</Link></div>
        <div className="nav-item"><Link to="/services">Services</Link></div>
        <div className="nav-item"><Link to="/tarifs">Prices</Link></div>
        <div className="nav-item">
          <button id="changeLang">FR</button>
        </div>
      </div>

      <div className="burger-menu" onClick={() => setNavOpen(!navOpen)}>
        <div className="burger-icon"></div>
        <div className="burger-icon"></div>
        <div className="burger-icon"></div>
      </div>
    </nav>
  );
};

export default Nav;
