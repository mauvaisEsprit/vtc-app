// FAQ.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import '../styles/FAQ.css'

export default function FAQ() {
  const { t } = useTranslation();
  const imageFAQ = "https://www.agence-winter.com/uploads/accommodations/2157/pictures/343844/index/winter-immobilier-appartement-nice-port-nice-13a2676d5e6f2a7e12219e3035c25a26_882070a1b2_1920.jpg?1745046222";
  const textFAQ = t("faq.heroText");
  const buttonTextFAQ = t("faq.heroButton");

  return (
    <div>
        <Hero image={imageFAQ} text={textFAQ} buttonText={buttonTextFAQ} />
        <div className="faq-page" style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
          <h1>{t("faq.title")}</h1>
          <h2>{t("faq.q1")}</h2>
          <p>{t("faq.a1")}</p>
          <h2>{t("faq.q2")}</h2>
          <p>{t("faq.a2")}</p>
          <h2>{t("faq.q3")}</h2>
          <p>{t("faq.a3")}</p>
          <h2>{t("faq.q4")}</h2>
          <p>{t("faq.a4")}</p>
          <h2>{t("faq.q5")}</h2>
          <p>{t("faq.a5")}</p>
        </div>
    </div>
  );
}
