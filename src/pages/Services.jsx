import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/Services.css";
import Hero from "../components/Hero";

export default function Services() {
  const { t } = useTranslation();

  const imageServices = "https://cms.enjourney.ru/upload/Jana/Frankreich/Nice%20city/Nice19.jpg";
  const textServices = t("services.heroText");
  const buttonTextServices = t("services.heroButton");

  return (
    <div>
      <Hero image={imageServices} text={textServices} buttonText={buttonTextServices} />
      <div className="services-page">
        <div className="container">
          <h1>{t("services.title")}</h1>

          <div className="service-section">
            <h2>{t("services.service1.title")}</h2>
            <p>{t("services.service1.description")}</p>
            <Link to="/#booking">
              <button className="service-button">{t("services.bookButton")}</button>
            </Link>
          </div>

          <div className="service-section">
            <h2>{t("services.service2.title")}</h2>
            <p>{t("services.service2.description")}</p>
            <Link to="/#booking2">
              <button className="service-button">{t("services.bookButton")}</button>
            </Link>
          </div>

          <div className="service-section">
            <h2>{t("services.service3.title")}</h2>
            <p>{t("services.service3.description")}</p>
            <Link to="/#booking">
              <button className="service-button">{t("services.bookButton")}</button>
            </Link>
          </div>

          <div className="service-section">
            <h2>{t("services.service4.title")}</h2>
            <p>{t("services.service4.description")}</p>
            <Link to="/#booking">
              <button className="service-button">{t("services.bookButton")}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
