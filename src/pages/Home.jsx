import Hero from "../components/Hero";
import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BookingForm from "../components/BookingForm";


export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const bookingRef = useRef(null);

  const imageHome =
    "https://unpluggedperformance.com/wp-content/uploads/2024/09/2024-Tesla-Model-3-Performance-Black-19-inch-UP-05-Forged-Wheels-in-Satin-Titanium-Unplugged-Performance-1920px-Image-13.jpg";

  const textHome = t("home.heroText");
  const buttonTextHome = t("home.heroButton");

  useEffect(() => {
    if (location.hash === "#booking" && bookingRef.current) {
      const offset = -100; // если есть фиксированный header
      const position =
        bookingRef.current.getBoundingClientRect().top +
        window.scrollY +
        offset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <>
      <Hero
        image={imageHome}
        text={textHome}
        buttonText={buttonTextHome}
        scrollTargetId="booking"
      />

      <div id="booking" ref={bookingRef}>
        
        <BookingForm />
      </div>
    </>
  );
}
