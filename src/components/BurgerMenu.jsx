import "../styles/BurgerMenu.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BurgerMenu() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Состояние языка только для кнопки, инициализируем из i18n.language
  const [lang, setLang] = useState(i18n.language.startsWith("fr") ? "FR" : "EN");

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // При смене языка меняем и локальный стейт, и i18n язык
  const toggleLang = () => {
    const newLang = lang === "FR" ? "EN" : "FR";
    setLang(newLang);
    i18n.changeLanguage(newLang.toLowerCase());
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
          <div className="logo">Blue Coast</div>
          <div className="close-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
          </div>

          <nav>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/services" onClick={toggleMenu}>
              Services
            </Link>
            <Link to="/aboutus" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/tarifs" onClick={toggleMenu}>
              Tarifs
            </Link>
            <button
              id="changeLang"
              onClick={() => {
                toggleLang();
                toggleMenu();
              }}
            >
              {lang}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
