import "../styles/HeroImage.css";
import { useRef } from "react";
import BookingForm from "../components/BookingForm";

export default function HeroImage() {
  const bookingRef = useRef(null);

const scrollToBooking = () => {
  const headerHeight = window.innerWidth <= 768 ? 75 : 120;

  // Получаем координаты элемента
  const elementTop = bookingRef.current?.getBoundingClientRect().top || 0;

  // Скроллим с учётом текущей прокрутки и хедера
  const offsetTop = window.scrollY + elementTop - headerHeight ; // небольшой запас сверху

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
};


  return (
    <div>
      <div className="teslaImage">
        <img
          src="https://unpluggedperformance.com/wp-content/uploads/2024/09/2024-Tesla-Model-3-Performance-Black-19-inch-UP-05-Forged-Wheels-in-Satin-Titanium-Unplugged-Performance-1920px-Image-13.jpg"
          alt="image"
        />
        <div className="overlay-text">
          <h1>Chauffeur VTC privé sur Nice et toute la Côte d’Azur</h1>
        </div>
        <button className="buttonRes" onClick={scrollToBooking}>
          Book now
        </button>
      </div>

      <div ref={bookingRef}>
        <BookingForm />
      </div>
    </div>
  );
}
