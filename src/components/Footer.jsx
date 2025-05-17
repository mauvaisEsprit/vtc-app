import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"; 
import { NavLink } from "react-router-dom";
import "../styles/Footer.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>{t("footer.linksTitle")}</h3>
          <ul>
            <li>
              <a href="/faq">{t("footer.faq")}</a>
            </li>
            <li>
              <a href="/contact">{t("footer.contact")}</a>
            </li>
            <li>
              <a href="/support">{t("footer.support")}</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t("footer.infoTitle")}</h3>
          <ul>
            <li>
              <NavLink to="/">{t("footer.home")}</NavLink>
            </li>
            <li>
              <NavLink to="/aboutus">{t("footer.aboutUs")}</NavLink>
            </li>
            <li>
              <NavLink to="/services">{t("footer.services")}</NavLink>
            </li>
            <li>
              <NavLink to="/tarifs">{t("footer.tarifs")}</NavLink>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t("footer.followUs")}</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
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
