import { useState } from "react";
import { useCallback } from "react";
import "../styles/BookingForm.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import RouteMap from "./RouteMap";

// Импорт локалей
import en from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import ru from "date-fns/locale/ru";

// Регистрация локалей
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("ru", ru);

export default function BookingForm() {
  const { t, i18n } = useTranslation();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const [adults, setAdults] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const localeMap = {
    "en": "en",
    "en-US": "en",
    "fr": "fr",
    "fr-FR": "fr",
    "ru": "ru",
    "ru-RU": "ru",
  };
  const currentLocale = localeMap[i18n.language] || "en";





  const handlePriceCalculated = useCallback((newPrice) => {
    setPrice(newPrice);
  }, []);

  const handleLoading = useCallback((value) => {
    setLoading(value);
  }, []);





  const handleAdultsChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      const numVal = val === "" ? 0 : Number(val);
      const numChildren = children === "" ? 0 : Number(children);
      if (numVal + numChildren > 4) {
        setError(t("form.error.tooManyPeople"));
      } else if (numVal < 1 && val !== "") {
        setError(t("form.error.atLeastOneAdult"));
      } else {
        setError("");
        setAdults(val);
      }
    }
  };

  const handleChildrenChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      const numVal = val === "" ? 0 : Number(val);
      const numAdults = adults === "" ? 0 : Number(adults);
      if (numVal + numAdults > 4) {
        setError(t("form.error.tooManyPeople"));
      } else {
        setError("");
        setChildren(val);
      }
    }
  };

  const formatDateParis = (date) => {
    return date.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const minDateTime = new Date(Date.now() + 60 * 60 * 1000);

  const getMinTime = (date) => {
    if (!date) return new Date().setHours(0, 0, 0, 0);
    if (
      date.getDate() === minDateTime.getDate() &&
      date.getMonth() === minDateTime.getMonth() &&
      date.getFullYear() === minDateTime.getFullYear()
    ) {
      return minDateTime;
    } else {
      const midnight = new Date(date);
      midnight.setHours(0, 0, 0, 0);
      return midnight;
    }
  };

  const getMaxTime = (date) => {
    if (!date) return new Date().setHours(23, 45, 0, 0);
    const maxTime = new Date(date);
    maxTime.setHours(23, 45, 0, 0);
    return maxTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      alert(t("form.error.tooFast"));
      return;
    }

    const formData = new FormData(e.target);

    // Honeypot
    if (formData.get("website")) {
      console.warn("Spam bot detected.");
      return;
    }

    // Проверка даты
    if (!selectedDate || selectedDate < minDateTime) {
      alert(t("form.error.invalidDate"));
      return;
    }

    // Проверка длины комментария, если введён
    const comment = formData.get("comment");
    if (comment && comment.length > 0 && comment.length < 3) {
      alert(t("form.error.shortMessage"));
      return;
    }

    formData.set("date", formatDateParis(selectedDate));

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
        alert(t("form.success"));
        setAdults("");
        setChildren("");
        setSelectedDate(null);
        e.target.reset();
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
    setFrom("");
    setTo("");
    setPrice(null);
    setAdults(1);
    setChildren(0);
    setSelectedDate(null);
    setError("");
    setName("");
    setPhone("");
    setEmail("");
  };


  return (
    <div className="booking-form-container">
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="booking-form-header">
          <h2>{t("form.title1") || "Бронирование поездки"}</h2>
          <p>{t("form.description1") || "Пожалуйста, заполните форму, чтобы заказать поездку с нашим сервисом VTC. Выберите дату, маршрут и укажите данные для связи."}</p>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        {/* Шаг 1: Дата, откуда, куда, карта */}
        <label htmlFor="date" className="visually-hidden">Date</label>
        <DatePicker
          locale={currentLocale}
          className="booking-datepicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeIntervals={15}
          minDate={minDateTime}
          minTime={selectedDate ? getMinTime(selectedDate) : undefined}
          maxTime={selectedDate ? getMaxTime(selectedDate) : undefined}
          placeholderText={t("form.datePlaceholder")}
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          name="date"
          required
        />

        <input
          type="text"
          id="from"
          name="from"
          placeholder={t("form.from")}
          required
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input
          type="text"
          id="to"
          name="to"
          placeholder={t("form.to")}
          required
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <RouteMap
          from={from}
          to={to}
          onPriceCalculated={(price) => {
            setPrice(price);
            if (price === null) setLoading(false);
          }}
          setLoading={setLoading}
        />

        {/* Шаг 2: Имя */}
        <div className={`step-transition ${selectedDate && from && to ? "show" : ""}`}>
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

        {/* Шаг 3: Телефон и email */}
        <div className={`step-transition ${selectedDate && from && to && name ? "show" : ""}`}>

          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder={t("form.phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* Шаг 4: email */}
          <div className={`step-transition ${selectedDate && from && to && name && phone ? "show" : ""}`}></div>
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

        {/* Шаг 5: Взрослые и дети */}
        <div className={`step-transition ${selectedDate && from && to && !error && name && phone && email ? "show" : ""}`}>
          <input
            type="number"
            id="adults"
            name="adults"
            min="1"
            max="4"
            placeholder={t("form.adults")}
            required
            value={adults}
            onChange={handleAdultsChange}
          />

          <input
            type="number"
            id="children"
            name="children"
            min="0"
            max="3"
            placeholder={t("form.children")}
            value={children}
            onChange={handleChildrenChange}
          />

          {error && (
            <p id="error-message" style={{ color: "red" }}>{error}</p>
          )}
        </div>


        {/* Шаг 6: Прочее */}
        <div className={`step-transition ${selectedDate && from && to && adults && !error && name && phone && email ? "show" : ""}`}>
          <div id="baggage-container">
            <label htmlFor="baggage">{t("form.baggage")}</label>
            <label className="switch">
              <input type="checkbox" id="baggage" name="baggage" />
              <span className="slider"></span>
            </label>
          </div>

          <textarea
            id="comment"
            name="comment"
            rows="3"
            placeholder={t("form.comment")}
          ></textarea>
        </div>

        {loading ? (
          <div className="spinner1"></div> // показываем только спиннер во время загрузки
        ) : price ? (
          <p>{t("form.estimatedPrice")} <strong>{price}</strong></p> // после загрузки показываем фразу с ценой
        ) : (
          <p>{t("form.estimatedPrice")}</p> // изначально показываем только фразу без цены
        )}


        <div id="garant-container">
          <input type="checkbox" id="garant" name="garant" required />
          <label htmlFor="garant">{t("form.consent")}</label>
        </div>
        <button
          className="booking-form-button"
          type="submit"
          disabled={isSubmitting || !!error}
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
