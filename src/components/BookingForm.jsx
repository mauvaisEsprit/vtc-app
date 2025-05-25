import { useState, useEffect } from "react";
import "../styles/BookingForm.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import RouteMap from "./RouteMap";

// Импорт локалей
import en from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import ru from "date-fns/locale/ru";
import { GiArmoredPants } from "react-icons/gi";
/*import { g } from "framer-motion/client";*/

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
  const [isRoundTrip, setIsRoundTrip] = useState(false); // новое состояние
  const [adults, setAdults] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  // если хочешь, добавь стейт для даты обратного пути:
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);

  useEffect(() => {
    if (
      isRoundTrip &&
      selectedDate &&
      selectedReturnDate &&
      selectedReturnDate < selectedDate
    ) {
      // Корректируем: делаем дату возврата на 15 минут позже даты туда
      const adjustedReturn = new Date(selectedDate.getTime() + 15 * 60 * 1000);
      setSelectedReturnDate(adjustedReturn);
    }
  }, [selectedDate, selectedReturnDate, isRoundTrip]);

  const localeMap = {
    en: "en",
    "en-US": "en",
    fr: "fr",
    "fr-FR": "fr",
    ru: "ru",
    "ru-RU": "ru",
  };
  const currentLocale = localeMap[i18n.language] || "en";

  const handleRoundTripChange = (e) => {
    setIsRoundTrip(e.target.checked);
    if (!e.target.checked) {
      // если переключаем в "Туда" — можно очистить дату обратного пути, если есть
      // например, если добавишь selectedReturnDate
    }
  };

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
      // Собираем объект с данными формы для отправки
      const dataToSend = {
        from,
        to,
        date: selectedDate.toISOString(),
        returnDate:
          isRoundTrip && selectedReturnDate
            ? selectedReturnDate.toISOString()
            : null,

        adults: Number(adults) || 0,
        children: Number(children) || 0,
        name,
        phone,
        email,
        baggage: formData.get("baggage") === "on",
        comment: formData.get("comment") || "",
        isRoundTrip,
        garant: formData.get("garant") === "on",
        price: adjustedPrice,
      };
      console.log("Отправленные данные:", dataToSend);
      const response = await fetch("https://backtest1-0501.onrender.com/api/bookings/form1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      console.log("Ответ сервера:", response);

      if (response.ok) {
        alert(t("form.success"));
        setAdults("");
        setChildren("");
        setFrom("");
        setTo("");
        setPrice(null);
        setSelectedReturnDate(null);
        setError("");
        setName("");
        setPhone("");
        setEmail("");
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
    setSelectedReturnDate(null);
    setIsRoundTrip(false); // сбрасываем переключатель
    setLoading(false);
    setIsSubmitting(false);
  };

  const numericPrice = Number(price);
  const adjustedPrice = !isNaN(numericPrice)
    ? isRoundTrip
      ? numericPrice * 1.9
      : numericPrice
    : null;

  return (
    <div className="booking-form-container">
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="booking-form-header">
          <h2>{t("form.title1")}</h2>
          <p>{t("form.description1")}</p>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />

        {/* Добавляем переключатель */}
        <div className="trip-type-toggle">
          <input
            type="checkbox"
            id="tripTypeToggle"
            checked={isRoundTrip}
            onChange={handleRoundTripChange}
          />
          <label htmlFor="tripTypeToggle"></label>
          <span className="label-text">{t("form.roundTrip")}</span>
        </div>

        {/* Шаг 1: Дата, откуда, куда, карта */}
        <label htmlFor="date" className="visually-hidden">
          Date
        </label>
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
          onFocus={(e) => e.target.blur()} // убираем фокус сразу после получения
        />

        {/* Если выбран round trip — показываем дату обратного пути */}
        {isRoundTrip && (
          <>
            <label htmlFor="returnDate" className="visually-hidden">
              Return Date
            </label>
            <DatePicker
              locale={currentLocale}
              className="booking-datepicker"
              selected={selectedReturnDate}
              onChange={(date) => setSelectedReturnDate(date)}
              showTimeSelect
              timeIntervals={15}
              minDate={selectedDate || minDateTime} // минимум — дата туда
              minTime={
                selectedReturnDate &&
                selectedDate &&
                selectedReturnDate.toDateString() ===
                  selectedDate.toDateString()
                  ? getMinTime(selectedDate)
                  : new Date(0, 0, 0, 0, 0) // иначе любое время
              }
              maxTime={new Date(0, 0, 0, 23, 45)}
              placeholderText={t("form.returnDatePlaceholder")}
              dateFormat="dd/MM/yyyy HH:mm"
              timeFormat="HH:mm"
              name="returnDate"
              onFocus={(e) => e.target.blur()} // убираем фокус сразу после получения
              required={isRoundTrip}
            />
          </>
        )}

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
        <div
          className={`step-transition ${
            selectedDate && from && to ? "show" : ""
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

        {/* Шаг 3: Телефон и email */}
        <div
          className={`step-transition ${
            selectedDate && from && to && name ? "show" : ""
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

          {/* Шаг 4: email */}
          <div
            className={`step-transition ${
              selectedDate && from && to && name && phone ? "show" : ""
            }`}
          ></div>
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
        <div
          className={`step-transition ${
            selectedDate && from && to && !error && name && phone && email
              ? "show"
              : ""
          }`}
        >
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
            <p id="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </div>

        {/* Шаг 6: Прочее */}
        <div
          className={`step-transition ${
            selectedDate &&
            from &&
            to &&
            adults &&
            !error &&
            name &&
            phone &&
            email
              ? "show"
              : ""
          }`}
        >
          <div id="baggage-container">
            <label className="switch">
              <input type="checkbox" id="baggage" name="baggage" />
              <span className="slider"></span>
            </label>
            <span className="label-text">{t("form.baggage")}</span>
          </div>

          <textarea
            id="comment"
            name="comment"
            rows="3"
            placeholder={t("form.comment")}
          ></textarea>
        </div>

        {loading ? (
          <div className="spinner1"></div>
        ) : adjustedPrice !== null && adjustedPrice > 0 ? (
          <p>
            {t("form.estimatedPrice")}{" "}
            <strong>{adjustedPrice.toFixed(2)}</strong>
          </p>
        ) : (
          <p>{t("form.estimatedPrice")}</p>
        )}

        <div
          className={`step-transition ${
            selectedDate &&
            from &&
            to &&
            adults &&
            !error &&
            name &&
            phone &&
            email
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
