import "../styles/HeroTarifs.css";
import { useRef } from "react";


export default function HeroTarifs() {
  const bookingRef = useRef(null);

const scrollToBooking = () => {
  const headerHeight = window.innerWidth <= 768 ? 75 : 120;
  const offset = -headerHeight ; // +30 для небольшого зазора
  const elementPosition = bookingRef.current.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset + offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

  return (
<div>
      <div className="teslaImage">
        <img
          src="https://www.ophorus.com/UPLOADS/DESTINATIONS/13/ophorus-167985-nice_large.jpeg" 
          alt="image"
        />
        <div className="overlay-text">
          <h1>Calculez le tarif de votre trajet</h1>
        </div>
        <button className="buttonRes" onClick={scrollToBooking}>
          Calculez le tarif
        </button>
      </div>

      <div ref={bookingRef}>
        
      </div>
    </div>
  );
}