import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaTelegram } from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";
import "../styles/Footer.css";
import { useTranslation } from "react-i18next";


export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  

  const handleLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault(); // уже на этой странице — просто скроллим вверх
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // иначе NavLink сам сработает
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>{t("footer.linksTitle")}</h3>
          <ul>
            <li>
              <NavLink to="/faq" onClick={(e) => handleLinkClick(e, "/faq")}>
                {t("footer.faq")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={(e) => handleLinkClick(e, "/contact")}>
                {t("footer.contact")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/support" onClick={(e) => handleLinkClick(e, "/support")}>
                {t("footer.support")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/mentions-legales" onClick={(e) => handleLinkClick(e, "/mentions-legales")}>
                {t("footer.mentionsLegales")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/politique-de-confidentialite" onClick={(e) => handleLinkClick(e, "/politique-de-confidentialite")}>
                {t("footer.privacyPolicy")}
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>{t("footer.infoTitle")}</h3>
          <ul>
            <li>
              <NavLink to="/" onClick={(e) => handleLinkClick(e, "/")}>
                {t("footer.home")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/aboutus" onClick={(e) => handleLinkClick(e, "/aboutus")}>
                {t("footer.aboutUs")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={(e) => handleLinkClick(e, "/services")}>
                {t("footer.services")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/tarifs" onClick={(e) => handleLinkClick(e, "/tarifs")}>
                {t("footer.tarifs")}
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>{t("footer.followUs")}</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <FaTelegram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Vladyslav Petrenko. {t("footer.rightsReserved")}</p>
      </div>
    </footer>
  );
}