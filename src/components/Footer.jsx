import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"; 
import { NavLink } from 'react-router-dom';
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Test</h3>
          <ul>
            <li>
              <NavLink to="#">Test</NavLink>
            </li>
            <li>
              <NavLink to="#">Test</NavLink>
            </li>
            <li>
              <NavLink to="#">Test</NavLink>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Infos</h3>
          <ul>
            <li>
              <NavLink to="/aboutus">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink to="/tarifs">Tarifs</NavLink>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Suivez-nous</h3>
          <div className="social-icons">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
        <div className="footer-bottom">
            <p>&copy; 2025 {`Petro Limonov`}. Tous droits réservés.</p>
        </div>
    </footer>
  );
}
