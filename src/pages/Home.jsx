import Hero from "../components/Hero";
import { useLocation, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BookingForm from "../components/BookingForm";
import SecondForm from "../components/SecondForm";
import "../styles/Home.css";
import TextHome from "../components/TextHome";
import GalleryCarousel from "../components/GalleryCarousel";
import AOS from "aos";
import "aos/dist/aos.css";



export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const bookingRef = useRef(null);
  const [bookingType, setBookingType] = useState("standard");

  const imageHome =
    "https://unpluggedperformance.com/wp-content/uploads/2024/09/2024-Tesla-Model-3-Performance-Black-19-inch-UP-05-Forged-Wheels-in-Satin-Titanium-Unplugged-Performance-1920px-Image-13.jpg";
  const textHome = t("home.heroText");
  const buttonTextHome = t("home.heroButton");

  useEffect(() => {
  AOS.init({
    duration: 800, // время анимации в мс
    once: true, // анимация сработает только один раз при скролле
    easing: "ease-in-out",
  });
}, []);

useEffect(() => {
  AOS.refresh();
}, [bookingType]);  // или другой state/prop, влияющий на контент


// Устанавливаем нужный тип формы
useEffect(() => {
  if (location.hash === "#booking2") {
    setBookingType("disposition");
  } else if (location.hash === "#booking") {
    setBookingType("standard");
  }
}, [location.hash]);

// Прокрутка после полной загрузки
useEffect(() => {
  const hash = location.hash;
  if (!hash) return;

  const scrollToHash = () => {
    const element = document.querySelector(hash);
    if (element) {
       const headerHeight = window.innerWidth <= 768 ? 270 : 300;
      const offset = -headerHeight ;
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleLoad = () => {
    scrollToHash();
  };

  // Если страница уже загружена — прокручиваем сразу
  if (document.readyState === "complete") {
    scrollToHash();
  } else {
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }
}, [bookingType, location.hash]);

  return (
    <>
      <Hero
        data-aos="fade-up"
        image={imageHome}
        text={textHome}
        buttonText={buttonTextHome}
        scrollTargetId="booking"
      />
      <TextHome data-aos="fade-up"/>

      
        <div className="type-switch" data-aos="fade-up">
          <Link to="/#booking">
            <button
              className={bookingType === "standard" ? "active" : "not-active"}
              onClick={() => setBookingType("standard")}
            >
              {t("form.standard")}
            </button>
          </Link>
          <Link to="/#booking2">
            <button
              className={bookingType === "disposition" ? "active" : "not-active"}
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
      <section className="why-choose-us" data-aos="fade-up">
  <h2>{t("home.whyChooseUsTitle")}</h2>
  <ul>
    <li>{t("home.why1")}</li>
    <li>{t("home.why2")}</li>
    <li>{t("home.why3")}</li>
    <li>{t("home.why4")}</li>
    <li>{t("home.why5")}</li>
  </ul>
</section>
<section className="testimonials" data-aos="fade-up">
  <h2>{t("home.testimonialsTitle")}</h2>
  <div className="testimonial"data-aos="fade-right">
    <blockquote>“{t("home.testimonial1.text")}”</blockquote>
    <footer>— {t("home.testimonial1.author")}</footer>
  </div>
  <div className="testimonial" data-aos="fade-left">
    <blockquote>“{t("home.testimonial2.text")}”</blockquote>
    <footer>— {t("home.testimonial2.author")}</footer>
  </div>
</section>

  <GalleryCarousel />



    </>
  );
}