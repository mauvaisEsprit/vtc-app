import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import "../styles/FAQ.css";

export default function FAQ() {
  const { t } = useTranslation();
  const imageFAQ = "https://www.agence-winter.com/uploads/accommodations/2157/pictures/343844/index/winter-immobilier-appartement-nice-port-nice-13a2676d5e6f2a7e12219e3035c25a26_882070a1b2_1920.jpg?1745046222";
  const textFAQ = t("faq.heroText");
  const buttonTextFAQ = t("faq.heroButton");

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  }));

  return (
    <div>
      <Hero image={imageFAQ} text={textFAQ} buttonText={buttonTextFAQ} />

      <div className="faq-page">
        <h1>{t("faq.title")}</h1>
        <div className="accordion">
          {faqItems.map((item, index) => (
            <div key={index} className="accordion-item">
              <button
                className={`accordion-question ${activeIndex === index ? "active" : ""}`}
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
              </button>
              <div
  className={`accordion-answer ${activeIndex === index ? "open" : ""}`}
>
  <p>{item.answer}</p>
</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
