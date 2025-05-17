import React, { useState } from 'react';
import { NavLink as Link, useLocation } from 'react-router-dom';
import '../styles/Nav.css';
import BurgerMenu from './BurgerMenu';

export default function Nav() {
  const [lang, setLang] = useState('EN');
  const location = useLocation();

  const toggleLang = () => {
    setLang(prev => (prev === 'FR' ? 'EN' : 'FR'));
  };

  const pages = [
    { path: '/', label: 'Home' },
    { path: '/aboutus', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/tarifs', label: 'Tarifs' },
  ];

  return (
    <nav className="nav">
      {/* Десктоп-меню */}
      <div className="nav-menu">
        {pages
          .filter(page => page.path !== location.pathname)
          .map(page => (
            <div key={page.path} className="nav-item">
              <Link to={page.path}>{page.label}</Link>
            </div>
          ))}
        <div className="nav-item">
          <button id="changeLang" onClick={toggleLang}>{lang}</button>
        </div>
      </div>

      {/* Бургер-меню отображается отдельно */}
      <BurgerMenu />
    </nav>
  );
}
