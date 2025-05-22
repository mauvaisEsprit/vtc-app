import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/AboutUs.css";
import Hero from "../components/Hero";

export default function AboutUs() {
  const { t } = useTranslation();

  const imageAboutUs = "https://tournavigator.pro/%D1%84%D0%BE%D1%82%D0%BE/other/1023/1013/1467904902.jpg";
  const textAboutUs = t("aboutUs.heroText");
  const buttonTextAboutUs = t("aboutUs.heroButton");

  return (
    <div>
      <Hero image={imageAboutUs} text={textAboutUs} buttonText={buttonTextAboutUs} />

      <div className="about-page">
        <div className="container">
          <h1>{t("aboutUs.title")}</h1>

          <p>{t("aboutUs.paragraph1")}</p>
          <p>{t("aboutUs.paragraph2")}</p>
          <p>{t("aboutUs.paragraph3")}</p>

          <h2>{t("aboutUs.missionTitle")}</h2>
          <p>{t("aboutUs.missionText")}</p>

          <h2>{t("aboutUs.visionTitle")}</h2>
          <p>{t("aboutUs.visionText")}</p>

          <h2>{t("aboutUs.commitmentsTitle")}</h2>
          <ul>
            <li>{t("aboutUs.commitment1")}</li>
            <li>{t("aboutUs.commitment2")}</li>
            <li>{t("aboutUs.commitment3")}</li>
            <li>{t("aboutUs.commitment4")}</li>
            <li>{t("aboutUs.commitment5")}</li>
            <li>{t("aboutUs.commitment6")}</li>
          </ul>

          <h2>{t("aboutUs.whyChooseUsTitle")}</h2>
          <ul>
            <li>{t("aboutUs.reason1")}</li>
            <li>{t("aboutUs.reason2")}</li>
            <li>{t("aboutUs.reason3")}</li>
            <li>{t("aboutUs.reason4")}</li>
            <li>{t("aboutUs.reason5")}</li>
          </ul>

          <h2>{t("aboutUs.testimonialsTitle")}</h2>
          <div className="testimonials">
            <blockquote>
              “{t("aboutUs.testimonial1.text")}”
              <footer>— {t("aboutUs.testimonial1.author")}</footer>
            </blockquote>
            <blockquote>
              “{t("aboutUs.testimonial2.text")}”
              <footer>— {t("aboutUs.testimonial2.author")}</footer>
            </blockquote>
            <blockquote>
              “{t("aboutUs.testimonial3.text")}”
              <footer>— {t("aboutUs.testimonial3.author")}</footer>
            </blockquote>
          </div>

          <h2>{t("aboutUs.galleryTitle")}</h2>
<div className="gallery">
  <img src="https://media.istockphoto.com/id/1257559116/photo/woman-likes-customer-service-in-a-private-taxi.webp?a=1&b=1&s=612x612&w=0&k=20&c=PyZW28eFRD66OYM-1h3VuQwAxNOkZb-4Wfa9_Q_Adiw=" alt="Luxury car" />
  <img src="https://plus.unsplash.com/premium_photo-1661402137057-8912a733c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hhdWZmZXVyJTIwbmljZXxlbnwwfHwwfHx8MA%3D%3D://images.unsplash.com/photo-1570129477492-45c003edd2be" alt="Chauffeur opening door" />
  <img src="https://media.istockphoto.com/id/500785096/photo/top-class-transportation.webp?a=1&b=1&s=612x612&w=0&k=20&c=uqzMjn_ag8H53J-wpopoSa5_5TSXgLK_5LOiJ8Sj0gY=" alt="Premium car interior" />
</div>

        </div>
      </div>
    </div>
  );
}
