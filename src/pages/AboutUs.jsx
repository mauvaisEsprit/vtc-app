import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/AboutUs.css";
import Hero from "../components/Hero";

export default function AboutUs() {
  const { t } = useTranslation();

  const imageAboutUs = "https://tournavigator.pro/%D1%84%D0%BE%D1%82%D0%BE/other/1023/1013/1467904902.jpg";
  const textAboutUs = t("aboutUs.heroText");       // ключ для текста на Hero
  const buttonTextAboutUs = t("aboutUs.heroButton"); // ключ для текста кнопки

  return (
    <div>
      <Hero image={imageAboutUs} text={textAboutUs} buttonText={buttonTextAboutUs} />
      <div className="about-page">
        <div className="container">
          <h1>{t("aboutUs.title")}</h1>
          <p>{t("aboutUs.paragraph1")}</p>
          <p>{t("aboutUs.paragraph2")}</p>
          <p>{t("aboutUs.paragraph3")}</p>
          <h2>{t("aboutUs.commitmentsTitle")}</h2>
          <ul>
            <li>{t("aboutUs.commitment1")}</li>
            <li>{t("aboutUs.commitment2")}</li>
            <li>{t("aboutUs.commitment3")}</li>
            <li>{t("aboutUs.commitment4")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
