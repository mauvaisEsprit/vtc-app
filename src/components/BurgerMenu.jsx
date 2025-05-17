import "../styles/BurgerMenu.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleLang = () => {
    setLang((prev) => (prev === "FR" ? "EN" : "FR"));
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
