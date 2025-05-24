import Hero from "../components/Hero";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [bookingType, setBookingType] = useState("standard");

  const imageHome =
    "https://unpluggedperformance.com/wp-content/uploads/2024/09/2024-Tesla-Model-3-Performance-Black-19-inch-UP-05-Forged-Wheels-in-Satin-Titanium-Unplugged-Performance-1920px-Image-13.jpg";
  const textHome = t("home.heroText");
  const buttonTextHome = t("home.heroButton");

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [bookingType]);

  useEffect(() => {
  const hash = location.hash;

  if (hash === "#booking2") {
    setBookingType("disposition");
  } else if (hash === "#booking") {
    setBookingType("standard");
  }
}, []); // только при монтировании

  /*const scrollTo = (sectionId) => {
    if (!sectionId) return;
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };*/

  const handleSwitch = (type) => {
    setBookingType(type);
    const hash = type === "disposition" ? "#booking2" : "#booking";
    window.history.replaceState(null, "", hash);
  };

 useEffect(() => {
  const hash = window.location.hash;
  if (hash === "#booking" || hash === "#booking2") {
    const timer = setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        const offset = 300; // например, 100px отступ сверху
        const top = element.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }
}, [bookingType]);


  return (
    <>
      <Hero
        data-aos="fade-up"
        image={imageHome}
        text={textHome}
        buttonText={buttonTextHome}
        scrollTargetId="booking"
      />
      <TextHome data-aos="fade-up" />

      <div className="type-switch" data-aos="fade-up">
        <button
          className={bookingType === "standard" ? "active" : "not-active"}
          onClick={() => handleSwitch("standard")}
        >
          {t("form.standard")}
        </button>
        <button
          className={bookingType === "disposition" ? "active" : "not-active"}
          onClick={() => handleSwitch("disposition")}
        >
          {t("form.disposition")}
        </button>
      </div>

      {bookingType === "standard" ? (
        <div id="booking">
          <BookingForm />
        </div>
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
        <div className="testimonial" data-aos="fade-right">
          <blockquote>“{t("home.testimonial1.text")}”</blockquote>
          <footer>— {t("home.testimonial1.author")}</footer>
        </div>
        <div className="testimonial" data-aos="fade-right">
          <blockquote>“{t("home.testimonial2.text")}”</blockquote>
          <footer>— {t("home.testimonial2.author")}</footer>
        </div>
      </section>

      <GalleryCarousel />
    </>
  );
}
