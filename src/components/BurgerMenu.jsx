import '../styles/BurgerMenu.css';
import { useState, useEffect } from 'react';

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  const toggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const toggleLang = () => {
    setLang(prev => (prev === 'FR' ? 'EN' : 'FR'));
  };

  return (
    <div className="burger-wrapper">
      {!isOpen && (
        <div className="burger-icon" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      )}

      {isOpen && (
        <div className="fullscreen-menu open">
          <div className="close-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
          </div>

          <nav>
            <a href="#home" onClick={toggleMenu}>Home</a>
            <a href="#services" onClick={toggleMenu}>Services</a>
            <a href="#about" onClick={toggleMenu}>About</a>
            <a href="#contact" onClick={toggleMenu}>Contact</a>
            <button id="changeLang" onClick={toggleLang}>{lang}</button>
          </nav>
        </div>
      )}
    </div>
  );
}
