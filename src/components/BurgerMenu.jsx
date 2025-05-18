import "../styles/BurgerMenu.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BurgerMenu() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = i18n.language.startsWith("fr")
    ? "fr"
    : i18n.language.startsWith("ru")
    ? "ru"
    : "en";

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toggleMenu();
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
              {t("navBurger.home")}
            </Link>
            <Link to="/services" onClick={toggleMenu}>
              {t("navBurger.services")}
            </Link>
            <Link to="/aboutus" onClick={toggleMenu}>
              {t("navBurger.aboutUs")}
            </Link>
            <Link to="/tarifs" onClick={toggleMenu}>
              {t("navBurger.tarifs")}
            </Link>

            <div className="lang-switcher">
              <button
                className={currentLang === "fr" ? "active-lang" : "not-active-lang"}
                onClick={() => changeLanguage("fr")}
              >
                FR
              </button>
              <button
                className={currentLang === "en" ? "active-lang" : "not-active-lang"}
                onClick={() => changeLanguage("en")}
              >
                EN
              </button>
              <button
                className={currentLang === "ru" ? "active-lang" : "not-active-lang"}
                onClick={() => changeLanguage("ru")}
              >
                RU
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
