import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Services.css";
import Hero from "../components/Hero";
import AOS from "aos";
import "aos/dist/aos.css";

const servicesData = [
  {
    key: "service1",
    img: "https://images.unsplash.com/photo-1658942445272-ef6bb53bd436?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlycG9ydCUyMHRheGl8ZW58MHx8MHx8fDA%3D",
    anchor: "#booking",
  },
  {
    key: "service2",
    img: "https://images.unsplash.com/photo-1730800328198-f9efbf9db53f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJpdmF0ZSUyMGRyaXZlcnxlbnwwfHwwfHx8MA%3D%3D",
    anchor: "#booking2",
  },
  {
    key: "service3",
    img: "https://images.unsplash.com/photo-1655757457375-c1668c7bc0ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHByaXZhdGUlMjBkcml2ZXIlMjBtYXJpYWdlfGVufDB8fDB8fHww",
    anchor: "#booking",
  },
  {
    key: "service4",
    img: "https://images.unsplash.com/photo-1560538490-e82f9a82b764?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHByaXZhdGUlMjBkcml2ZXIlMjBsb25nJTIwZGlzdGFuY2V8ZW58MHx8MHx8fDA%3D",
    anchor: "#booking",
  },
];

export default function Services() {
  const { t } = useTranslation();

  const imageServices = "https://cms.enjourney.ru/upload/Jana/Frankreich/Nice%20city/Nice19.jpg";
  const textServices = t("services.heroText");
  const buttonTextServices = t("services.heroButton");

useEffect(() => {
  AOS.init({
    duration: 800, // время анимации в мс
    once: true, // анимация сработает только один раз при скролле
    easing: "ease-in-out",
  });
}, []);
  return (
    <div>
      <Hero image={imageServices} text={textServices} buttonText={buttonTextServices} data-aos="fade-up"/>
      <div className="services-page" data-aos="fade-up">
        <div className="container" data-aos="fade-up">
          <h1>{t("services.title")}</h1>

          {servicesData.map(({ key, img, anchor }, index) => (
            <div
              key={key}
              className={`service-section ${index % 2 === 1 ? "reverse" : ""}`}
              data-aos="fade-up"
            >
              <div className="service-image-wrapper" data-aos="fade-up">
                <img
                  src={img}
                  alt={t(`services.${key}.title`)}
                  className="service-image"
                />
              </div>

              <div className="service-text" data-aos="fade-up">
                <h2>{t(`services.${key}.title`)}</h2>
                <p>{t(`services.${key}.description`)}</p>
                <Link to={`/${anchor}`}>
                  <button className="service-button">{t("services.bookButton")}</button>
                </Link>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
