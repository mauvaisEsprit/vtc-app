import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/BookingForm.css";

import en from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import ru from "date-fns/locale/ru";

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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const hourlyRate = 60;
  const totalPrice = duration ? duration * hourlyRate : 0;

  const localeMap = {
    en: "en",
    "en-US": "en",
    fr: "fr",
    "fr-FR": "fr",
    ru: "ru",
    "ru-RU": "ru",
  };
  const currentLocale = localeMap[i18n.language] || "en";

  const handleDateChange = (date) => {
    if (!date) {
      setSelectedDate(null);
      return;
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Проверяем, выбрана ли сегодня дата
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      // Если выбранное время раньше, чем сейчас + 1 час — корректируем
      if (date.getTime() < oneHourLater.getTime()) {
        setSelectedDate(oneHourLater);
        return;
      }
    }

    setSelectedDate(date);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (now - lastSubmitTime < 30000) {
    alert(t("form.error.tooFast"));
    return;
  }

  // Проверка даты
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000);
  if (!selectedDate || selectedDate < minDateTime) {
    alert(t("form.error.invalidDate"));
    return;
  }

  setIsSubmitting(true);

  const payload = {
    pickupLocation,
    duration: Number(duration),
    date: selectedDate.toISOString(),
    name,
    phone,
    email,
    tripPurpose: e.target.tripPurpose.value || "",
    totalPrice: totalPrice,
    garant: e.target.garant.checked,
  };

  try {
    const response = await fetch("https://backtest1-0501.onrender.com/api/bookings/form2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      alert(t("form.success"));
      handleReset();
      setLastSubmitTime(now);
    } else {
      alert(data.message || t("form.error.submit"));
    }
  } catch  {
    alert(t("form.error.network"));
  } finally {
    setIsSubmitting(false);
  }
};


  const handleReset = () => {
    setPickupLocation("");
    setDuration("");
    setSelectedDate(null);
    setName("");
    setPhone("");
    setEmail("");
    setIsSubmitting(false);
    setLastSubmitTime(0);
    document.getElementById("booking-form2").reset();
  };

  return (
    <div className="booking-form-container">
      <form className="booking-form" id="booking-form2" onSubmit={handleSubmit}>
        <div className="booking-form-header">
          <h2>{t("form.title2")}</h2>
          <p>{t("form.description2")}</p>
        </div>

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
          onChange={handleDateChange}
          showTimeSelect
          timeIntervals={15}
          minDate={new Date()} // запрещает выбор прошедших дней
          filterTime={(time) => {
            if (!selectedDate) return true;

            const now = new Date();
            const candidateTime = new Date(selectedDate);

            candidateTime.setHours(time.getHours());
            candidateTime.setMinutes(time.getMinutes());
            candidateTime.setSeconds(0);
            candidateTime.setMilliseconds(0);

            // Разрешаем все время для будущих дат
            if (
              candidateTime.getDate() !== now.getDate() ||
              candidateTime.getMonth() !== now.getMonth() ||
              candidateTime.getFullYear() !== now.getFullYear()
            ) {
              return true;
            }

            // Для сегодня — блокируем время в прошлом (меньше сейчас)
            return candidateTime.getTime() > now.getTime();
          }}
          placeholderText={t("form.datePlaceholder")}
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          name="date"
          onFocus={(e) => e.target.blur()}
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

        <div
          className={`step-transition ${
            selectedDate && pickupLocation ? "show" : ""
          }`}
        >
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
        </div>

        <div
          className={`step-transition ${
            selectedDate && pickupLocation && duration ? "show" : ""
          }`}
        >
          <input
            type="text"
            id="name"
            name="name"
            placeholder={t("form.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div
          className={`step-transition ${
            selectedDate && pickupLocation && duration && name ? "show" : ""
          }`}
        >
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder={t("form.phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div
          className={`step-transition ${
            selectedDate && pickupLocation && duration && name && phone
              ? "show"
              : ""
          }`}
        >
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t("form.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div
          className={`step-transition ${
            selectedDate && pickupLocation && duration && name && phone && email
              ? "show"
              : ""
          }`}
        >
          <textarea
            id="tripPurpose"
            name="tripPurpose"
            rows="3"
            placeholder={t("form.comment")}
          ></textarea>
        </div>

        <div className="price-summary">
          <p>
            {t("form.estimatedPrice")} <strong>{totalPrice} €</strong>
          </p>
        </div>

        <div
          className={`step-transition ${
            selectedDate && pickupLocation && duration && name && phone && email
              ? "show"
              : ""
          }`}
        >
          <div id="garant-container">
            <input type="checkbox" id="garant" name="garant" required />
            <label htmlFor="garant">{t("form.consent")}</label>
          </div>
        </div>

        <button
          className="booking-form-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("form.sending") : t("form.submit")}
        </button>

        <button
          className="booking-form-button"
          type="reset"
          onClick={handleReset}
        >
          {t("form.reset")}
        </button>
      </form>
    </div>
  );
}
