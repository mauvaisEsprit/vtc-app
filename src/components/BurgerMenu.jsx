import { useState, useEffect } from "react";
import "../styles/BurgerMenu.css";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);


useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  
  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);


  return (
    <div className="burger-wrapper">
      {!isOpen && (
        <div className="burger-icon" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      )}

      <div className={`fullscreen-menu ${isOpen ? "open" : ""}`}>
        {isOpen && (
          <div className="close-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
          </div>
        )}

        <nav>
          <a href="#home" onClick={toggleMenu}>
            Home
          </a>
          <a href="#services" onClick={toggleMenu}>
            Services
          </a>
          <a href="#about" onClick={toggleMenu}>
            About
          </a>
          <a href="#contact" onClick={toggleMenu}>
            Contact
          </a>
        </nav>
      </div>
    </div>
  );
}
