import Hero from "../components/Hero";
import { useLocation, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BookingForm from "../components/BookingForm";
import SecondForm from "../components/SecondForm";
import "../styles/Home.css";
import TextHome from "../components/TextHome";

export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const bookingRef = useRef(null);
  const [bookingType, setBookingType] = useState("standard");

  const imageHome =
    "https://unpluggedperformance.com/wp-content/uploads/2024/09/2024-Tesla-Model-3-Performance-Black-19-inch-UP-05-Forged-Wheels-in-Satin-Titanium-Unplugged-Performance-1920px-Image-13.jpg";

  const textHome = t("home.heroText");
  const buttonTextHome = t("home.heroButton");

  // Устанавливаем нужный тип формы
  useEffect(() => {
    if (location.hash === "#booking2") {
      setBookingType("disposition");
    } else if (location.hash === "#booking") {
      setBookingType("standard");
    }
  }, [location.hash]);

  // Прокрутка, когда bookingType и DOM готовы
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const scrollToHash = () => {
      const element = document.querySelector(hash);
      if (element) {
        const offset = hash === "#booking2" ? -200 : -200;
        const top = element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    // немного подождать, чтобы элемент точно был в DOM
    setTimeout(scrollToHash, 100);
  }, [bookingType, location.hash]);

  return (
    <>
      <Hero
        image={imageHome}
        text={textHome}
        buttonText={buttonTextHome}
        scrollTargetId="booking"
      />
      <TextHome />

      
        <div className="type-switch">
          <Link to="/#booking">
            <button
              className={bookingType === "standard" ? "active" : ""}
              onClick={() => setBookingType("standard")}
            >
              {t("form.standard")}
            </button>
          </Link>
          <Link to="/#booking2">
            <button
              className={bookingType === "disposition" ? "active" : ""}
              onClick={() => setBookingType("disposition")}
            >
              {t("form.disposition")}
            </button>
          </Link>
        </div>

        {bookingType === "standard" ? (
          <div id="booking" ref={bookingRef}>
            <BookingForm /> </div>
        ) : (
          <div id="booking2">
            <SecondForm />
          </div>
        )}
      
    </>
  );
}