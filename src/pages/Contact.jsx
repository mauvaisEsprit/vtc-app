import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import "../styles/Contact.css";

export default function Contact() {
  const { i18n, t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null); // 'error' | 'success'

  const currentLocale = i18n.language || "fr"; // Получаем текущий язык из i18n

  const imageContact =
    "https://img.12go.asia/0/fit/1024/0/ce/1/plain/s3://12go-web-static/static/images/upload-media/4670.jpeg";
  const textContact = t("contact.heroText");
  const buttonTextContact = t("contact.heroButton");

const handleSubmit = async (e) => {
  e.preventDefault();

  setStatusMessage(null);
  setStatusType(null);

  const now = Date.now();
  if (now - lastSubmitTime < 30000) {
    alert(t("form.error.tooFast"));
   
    return;
  }

  const formData = new FormData(e.target);

  // Honeypot check
  if (formData.get("website")) {
    console.warn("Spam bot detected.");
    return;
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!message || message.length < 10) {
    alert(t("form.error.shortMessage"));
    
    return;
  }

  setIsSubmitting(true);

  

  try {
    const response = await fetch("https://backtest1-0501.onrender.com/api/messages", {  // свой backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message, locale: currentLocale }),
    });

    

    if (response.ok) {
      alert(t("form2.success"));
      setStatusType("success");
      e.target.reset();
      setLastSubmitTime(now);
      
    } else {
      alert(t("form.error.submit"));
      setStatusType("error");
      
    }
  } catch (error) {
    console.error(error);
    alert(t("form.error.network"));
    
    
  } finally {
    setIsSubmitting(false);
    
  }
};


  return (
    <div>
      <Hero
        image={imageContact}
        text={textContact}
        buttonText={buttonTextContact}
      />
      <div
        className="contact-page"
        style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}
      >
        <h1>{t("contact.title", "Contact Us")}</h1>
        <p>{t("contact.desc")}</p>
        <p>
          <strong>{t("contact.phone", "Phone")}:</strong>{" "}
          <a href="tel:+33622649963"> +33 6 22 64 99 63</a>
        </p>
        <p>
          <strong>{t("contact.email", "Email")}:</strong>{" "}
          <a href="mailto:legionvlad@icloud.com"> legionvlad@icloud.com</a>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Honeypot — скрытое поле */}
          <input
            type="text"
            name="website"
            style={{ display: "none" }}
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />

          <label htmlFor="name">{t("contact.form.name")}*</label>
          <br />
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isSubmitting}
          />
          <br />
          <br />

          <label htmlFor="email">{t("contact.form.email")}*</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isSubmitting}
          />
          <br />
          <br />

          <label htmlFor="message">{t("contact.form.message")}*</label>
          <br />
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            disabled={isSubmitting}
          ></textarea>
          <br />
          <br />

          <div id="garant-container">
            <input
              type="checkbox"
              id="garant"
              name="garant"
              required
              disabled={isSubmitting}
            />
            <label htmlFor="garant">{t("form.consent")}</label>
          </div>

          {statusMessage && (
            <p
              style={{
                color: statusType === "error" ? "red" : "green",
                marginTop: "10px",
              }}
            >
              {statusMessage}
            </p>
          )}

          <button
            className="booking-form-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("form.sending") : t("contact.form.submit")}
          </button>

          <button
            className="booking-form-button"
            type="reset"
            disabled={isSubmitting}
          >
            {t("contact.form.reset")}
          </button>
        </form>
      </div>
    </div>
  );
}
