import React, { useState } from "react";
import { NavLink as Link, useLocation } from "react-router-dom";
import "../styles/Nav.css";
import BurgerMenu from "./BurgerMenu";
import { useTranslation } from "react-i18next";

export default function Nav() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;
  const [lang, setLang] = useState(currentLang.toUpperCase());

  const toggleLang = () => {
    const newLang = currentLang === "fr" ? "en" : "fr";
    setLang(newLang.toUpperCase());
    i18n.changeLanguage(newLang);
  };

  const pages = [
    { path: "/", label: t("nav.home") },
    { path: "/aboutus", label: t("nav.about") },
    { path: "/services", label: t("nav.services") },
    { path: "/tarifs", label: t("nav.tarifs") },
  ];

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
        <div className="nav-item">
          <button id="changeLang" onClick={toggleLang}>
            {lang}
          </button>
        </div>
      </div>

      <BurgerMenu />
    </nav>
  );
}
