import "../styles/Hero.css";
import { useRef } from "react";

export default function Hero({ image, text, buttonText }) {
  const bookingRef = useRef(null);

  const scrollToBooking = () => {
    const headerHeight = window.innerWidth <= 768 ? 75 : 120;
    const offset = -headerHeight; // +30 для небольшого зазора
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
        <img src={image} alt="image" />
        <div className="overlay-text">
          <h1>{text}</h1>
        </div>
        <button className="buttonRes" onClick={scrollToBooking}>
          {buttonText}
        </button>
      </div>

      <div ref={bookingRef}></div>
    </div>
  );
}
