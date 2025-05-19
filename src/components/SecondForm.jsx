import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/BookingForm.css";

// Импорт локалей
import en from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import ru from "date-fns/locale/ru";

// Регистрация локалей
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("ru", ru);

export default function SecondForm() {
  const { t, i18n } = useTranslation();

  const [pickupLocation, setPickupLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const minDateTime = new Date(Date.now() + 60 * 60 * 1000);

  const hourlyRate = 60;
  const totalPrice = duration ? duration * hourlyRate : 0;

  const localeMap = {
    "en": "en",
    "en-US": "en",
    "fr": "fr",
    "fr-FR": "fr",
    "ru": "ru",
    "ru-RU": "ru",
  };
  const currentLocale = localeMap[i18n.language] || "en";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      alert(t("form.error.tooFast"));
      return;
    }

    const formData = new FormData(e.target);

    if (formData.get("website")) return;

    if (!selectedDate || selectedDate < minDateTime) {
      alert(t("form.error.invalidDate"));
      return;
    }

    formData.set("date", selectedDate.toISOString());

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mgvalzay", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        alert(t("form.success"));
        e.target.reset();
        setPickupLocation("");
        setDuration("");
        setSelectedDate(null);
        setLastSubmitTime(now);
      } else {
        alert(t("form.error.submit"));
      }
    } catch {
      alert(t("form.error.network"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPickupLocation("");
    setDuration("");
    setSelectedDate(null);
  };

  return (
    <div className="booking-form-container">
      <form className="booking-form" id="booking-form2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        <DatePicker
          locale={currentLocale}
          className="booking-datepicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeIntervals={15}
          minDate={minDateTime}
          placeholderText={t("form.datePlaceholder")}
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          name="date"
          required
        />

        <input
          type="text"
          id="pickupLocation"
          name="pickupLocation"
          placeholder={t("form.pickupLocation")}
          required
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />

        <input
          type="number"
          id="durationSeconds"
          name="duration"
          placeholder={t("form.duration")}
          min="1"
          max="12"
          required
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          type="text"
          id="name"
          name="name"
          placeholder={t("form.name")}
          required
        />

        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder={t("form.phone")}
          required
        />

        <input
          type="email"
          id="email"
          name="email"
          placeholder={t("form.email")}
          required
        />
        <textarea
          id="tripPurpose"
          name="tripPurpose"
          rows="3"
          placeholder={t("form.comment")}
        ></textarea>

        <div className="price-summary">
          <p>
            {t("form.estimatedPrice")}: <strong>{totalPrice} €</strong>
          </p>
        </div>

        <div id="garant-container">
          <input type="checkbox" id="garant" name="garant" required />
          <label htmlFor="garant">{t("form.consent")}</label>
        </div>

        <button className="booking-form-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("form.sending") : t("form.submit")}
        </button>

        <button className="booking-form-button" type="reset" onClick={handleReset}>
          {t("form.reset")}
        </button>
      </form>
    </div>
  );
}