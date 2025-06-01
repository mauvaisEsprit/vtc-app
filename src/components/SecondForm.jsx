import { useState, useEffect } from "react";
import axios from "axios";
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
  const [suggestions, setSuggestions] = useState([]);
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [settings, setSettings] = useState({});

  



  const localeMap = {
    en: "en",
    "en-US": "en",
    fr: "fr",
    "fr-FR": "fr",
    ru: "ru",
    "ru-RU": "ru",
  };
  const currentLocale = localeMap[i18n.language] || "en";


useEffect(() => {
    // Цены (если есть такая коллекция)
    axios
      .get("https://backtest1-0501.onrender.com/api/login/admin/settings", {
        headers: {
          "Content-Type": "application/json",
        },
      })

      .then((res) => {
        setSettings(res.data);
      })
      .catch(console.error);
  }, []);


  const calculateHourlyPrice = (duration, settings) => {
  if (!settings?.pricePerHour) return 0; // если нет ставки — цена 0

  const hourlyRate = settings.pricePerHour;
  const firstPrice = duration ? (duration * hourlyRate + settings.minFare).toFixed(2) : "0.00";
  const totalPrice = parseFloat(firstPrice)
  return totalPrice;
};
  // Вычисляем цену на основе введенной продолжительности и настроек
  const totalPrice = calculateHourlyPrice(duration, settings);



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
      totalPrice: Number(totalPrice),
      garant: e.target.garant.checked,
      locale: currentLocale,
    };

    try {
      const response = await fetch(
        "https://backtest1-0501.onrender.com/api/hourly",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(t("form.success"));
        handleReset();
        setLastSubmitTime(now);
      } else {
        alert(data.message || t("form.error.submit"));
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
    setName("");
    setPhone("");
    setEmail("");
    setIsSubmitting(false);
    setLastSubmitTime(0);
    document.getElementById("booking-form2").reset();
  };

  useEffect(() => {
    if (pickupLocation.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: pickupLocation,
            format: "json",
            addressdetails: 1,
            limit: 5,
            countrycodes: "fr",
          },
          headers: {
            "Accept-Language": currentLocale,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSuggestions(res.data);
          } else {
            setSuggestions([]);
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки подсказок:", error);
          setSuggestions([]);
        });
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [pickupLocation, currentLocale]);

  const handleSelect = (address) => {
    setPickupLocation(address);
    setSuggestions([]);
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

        <div className="input-suggestion-wrapper">
          <input
            type="text"
            id="pickupLocation"
            name="pickupLocation"
            placeholder={t("form.pickupLocation")}
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              // небольшой таймер, чтобы успеть кликнуть по подсказке
              setTimeout(() => setIsInputFocused(false), 100);
            }}
            autoComplete="off"
          />

          {isInputFocused && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item.display_name)}>
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

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
            {t("form.estimatedPrice")} <strong>{totalPrice}€</strong>
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "#333" }}>
            * {t("tarifs.noteApproximate")}
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
