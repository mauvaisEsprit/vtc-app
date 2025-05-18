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
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
  ];

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <nav className="nav">
      <div className="nav-menu">
        {pages
          .filter((page) => page.path !== location.pathname)
          .map((page) => (
            <div key={page.path} className="nav-item">
              <Link to={page.path}>{page.label}</Link>
            </div>
          ))}

        <div className="nav-item lang-switcher">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLangChange(lang.code)}
              className={i18n.language === lang.code ? "active-lang" : "not-active-lang"}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <BurgerMenu />
    </nav>
  );
}
