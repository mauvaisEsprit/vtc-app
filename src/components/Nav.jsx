import React from "react";
import { NavLink as Link, useLocation } from "react-router-dom";
import "../styles/Nav.css";
import BurgerMenu from "./BurgerMenu";
import { useTranslation } from "react-i18next";



export default function Nav() {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  const pages = [
    { path: "/", label: t("nav.home") },
    { path: "/aboutus", label: t("nav.about") },
    { path: "/services", label: t("nav.services") },
    { path: "/tarifs", label: t("nav.tarifs") },
  ];

  const languages = [
  { code: "fr", img: "/flags/fr.svg" },
  { code: "en", img: "/flags/gb.svg" },
  { code: "ru", img: "/flags/ru.svg" },
];


  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-menu">
        {pages
          .filter((page) => page.path !== location.pathname)
          .map((page) => (
            <div key={page.path} className="nav-item">
              <Link to={page.path}>{page.label}</Link>
            </div>
          ))}
          </div>

        <div className="nav-item lang-switcher">
          {languages.map((lang) => (
            <button
  key={lang.code}
  onClick={() => handleLangChange(lang.code)}
  className={i18n.language === lang.code ? "active-lang" : "not-active-lang"}
>
  <img
    src={lang.img}
    alt={lang.code}
    style={{ width: "24px", height: "24px", borderRadius: "4px" }}
  />
</button>

          ))}
          </div>
      </div>

      <BurgerMenu />
    </nav>
  );
}
