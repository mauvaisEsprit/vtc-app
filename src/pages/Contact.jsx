import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from "../components/Hero";
import '../styles/Contact.css';

export default function Contact() {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const imageContact = "https://img.12go.asia/0/fit/1024/0/ce/1/plain/s3://12go-web-static/static/images/upload-media/4670.jpeg";
  const textContact = t("contact.heroText");
  const buttonTextContact = t("contact.heroButton");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      alert(t("form2.error.tooFast", "Please wait before sending again."));
      return;
    }

    const formData = new FormData(e.target);

    // Honeypot check
    if (formData.get("website")) {
      console.warn("Spam bot detected.");
      return;
    }

    const message = formData.get("message");
    if (!message || message.length < 10) {
      alert(t("form2.error.shortMessage", "Message is too short."));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mgvalzay", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert(t("form2.success", "Message sent successfully!"));
        e.target.reset();
        setLastSubmitTime(now);
      } else {
        alert(t("form2.error.submit", "Failed to send. Try again later."));
      }
    } catch (error) {
      alert(t("form2.error.network", "Network error. Try again later."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Hero image={imageContact} text={textContact} buttonText={buttonTextContact} />
      <div className="contact-page" style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
        <h1>{t('contact.title', 'Contact Us')}</h1>
        <p>{t('contact.desc')}</p>
        <p><strong>{t('contact.phone', 'Phone')}:</strong> +33 6 22 64 99 63</p>
        <p><strong>{t('contact.email', 'Email')}:</strong> info@bluecoastvtc.com</p>

        <form onSubmit={handleSubmit}>
          {/* Honeypot — скрытое поле */}
          <input type="text" name="website" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

          <label htmlFor="name">{t('contact.form.name', 'Name')}*</label><br />
          <input type="text" id="name" name="name" required /><br /><br />

          <label htmlFor="email">{t('contact.form.email', 'Email')}*</label><br />
          <input type="email" id="email" name="email" required /><br /><br />

          <label htmlFor="message">{t('contact.form.message', 'Message')}*</label><br />
          <textarea id="message" name="message" rows="5" required></textarea><br /><br />

          <div id="garant-container">
          <input type="checkbox" id="garant" name="garant" required />
          <label htmlFor="garant">{t("form.consent")}</label>
        </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('form2.sending', 'Sending...') : t('contact.form.submit', 'Send')}
          </button>
        </form>
      </div>
    </div>
  );
}
