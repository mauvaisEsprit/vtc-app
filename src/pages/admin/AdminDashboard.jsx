import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("standard"); // можно менять между: 'standard', 'hourly', 'messages', 'analytics', 'settings', 'drivers'
  const [standardBookings, setStandardBookings] = useState([]);
  const [hourlyBookings, setHourlyBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  const unconfirmedStandard = standardBookings.filter(
    (b) => !b.confirmed
  ).length;
  const unconfirmedHourly = hourlyBookings.filter((b) => !b.confirmed).length;
  const unrepliedMessages = messages.filter((m) => !m.replied).length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const handleError = (err) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        console.error(err);
      }
    };
    // Обычные поездки
    axios
      .get("https://backtest1-0501.onrender.com/api/bookings/login/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStandardBookings(res.data))
      .catch(handleError);

    // Почасовая аренда
    axios
      .get("https://backtest1-0501.onrender.com/api/hourly/login/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHourlyBookings(res.data))
      .catch(handleError);

    // Сообщения с сайта (если есть такая коллекция)
    axios
      .get("https://backtest1-0501.onrender.com/api/messages/login/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch(handleError);

    // Цены (если есть такая коллекция)
    axios
      .get("https://backtest1-0501.onrender.com/api/login/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSettings(res.data))
      .catch(console.error);
  }, [navigate]);

  const confirmBooking = useCallback(
    async (id, type) => {
      if (window.confirm(t("admin.confirmBooking"))) {
        const token = localStorage.getItem("token");
        const url =
          type === "hourly"
            ? `https://backtest1-0501.onrender.com/api/hourly/login/admin/${id}/confirm`
            : `https://backtest1-0501.onrender.com/api/bookings/login/admin/${id}/confirm`;

        await axios.put(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (type === "hourly") {
          setHourlyBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, confirmed: true } : b))
          );
        } else {
          setStandardBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, confirmed: true } : b))
          );
        }
      }
    },
    [t, setStandardBookings, setHourlyBookings]
  );

  const deleteBooking = async (id, type) => {
    if (window.confirm(t("admin.confirmDelete"))) {
      const card = document.getElementById(id);
      if (card) {
        card.classList.add("fade-out");
        try {
          await new Promise((resolve) => setTimeout(resolve, 500)); // ждем анимацию
          const token = localStorage.getItem("token");
          const url =
            type === "hourly"
              ? `https://backtest1-0501.onrender.com/api/hourly/login/admin/${id}`
              : `https://backtest1-0501.onrender.com/api/bookings/login/admin/${id}`;

          await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (type === "hourly") {
            setHourlyBookings((prev) => prev.filter((b) => b._id !== id));
          } else {
            setStandardBookings((prev) => prev.filter((b) => b._id !== id));
          }
        } catch (error) {
          console.error(error);
          card.classList.remove("fade-out"); // отменяем анимацию при ошибке
          alert(t("admin.errorDeletingBooking"));
        }
      }
    }
  };

  const replyMessage = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://backtest1-0501.onrender.com/api/messages/login/admin/${id}/reply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(t("admin.messageSentToClient"));

      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, replied: true } : msg))
      );
    } catch (error) {
      console.error(error);
      alert(t("admin.errorSendingEmail"));
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm(t("admin.confirmDeleteMessage"))) {
      const card = document.getElementById(id);
      if (card) {
        card.classList.add("fade-out");
        setTimeout(async () => {
          const token = localStorage.getItem("token");
          try {
            await axios.delete(
              `https://backtest1-0501.onrender.com/api/messages/login/admin/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setMessages((prev) => prev.filter((msg) => msg._id !== id));
          } catch (error) {
            console.error(error);
            alert(t("admin.errorDeletingMessage"));
          }
        }, 500);
      }
    }
  };

  const updateSettings = (field, value) => {
    const val = value.replace(/,/g, ".");
    setSettings((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm(t("admin.confirmSettingsUpdate"))) return;

    const token = localStorage.getItem("token");

    // Преобразуем поля в числа
    const payload = {
      pricePerKm: parseFloat(settings.pricePerKm),
      coefForRoundTrip: parseFloat(settings.coefForRoundTrip),
      minFare: parseFloat(settings.minFare),
      pricePerHour: parseFloat(settings.pricePerHour),
      locale: settings.locale, // если нужно
    };

    console.log("Updating settings with payload:", payload);
    console.log("pricePerMin raw value:", settings.coefForRoundTrip);

    // Проверка на ошибки в числе
    if (
      isNaN(payload.pricePerKm) ||
      isNaN(payload.coefForRoundTrip) ||
      isNaN(payload.minFare) ||
      isNaN(payload.pricePerHour)
    ) {
      alert(t("admin.invalidPrice"));
      return;
    }
    console.log("pricePerMin after conversion:", payload.coefForRoundTrip);
    console.log(settings.coefForRoundTrip);
    try {
      const response = await axios.put(
        `https://backtest1-0501.onrender.com/api/login/admin/settings/${settings._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSettings(response.data);
      alert(t("admin.settingsUpdated"));
    } catch (error) {
      console.error("Error updating settings:", error.response?.data || error);
      alert(t("admin.errorUpdatingSettings"));
    }
  };

  const renderBookingList = (bookings, type) =>
    bookings.map((b) => (
      <div
        key={b._id}
        id={b._id}
        className={`booking-card ${b.confirmed ? "confirmed" : "pending"}`}
      >
        <div className="booking-header">
          <h2>
            {t("admin.bookingNumber")}:{" "}
            <span className="booking-id">{b.bookingNumber}</span>
          </h2>
          <span
            className={`status-badge ${
              b.confirmed ? "status-confirmed" : "status-pending"
            }`}
          >
            {b.confirmed ? t("admin.confirmed") : t("admin.notConfirmed")}
          </span>
        </div>

        <div className="booking-info">
          <p>
            <b>{t("admin.dateCreation")}:</b>{" "}
            {new Date(b.createdAt).toLocaleString("fr-FR", {
              timeZone: "Europe/Paris",
            })}
          </p>
          <p>
            <b>{t("admin.name")}:</b> {b.name}
          </p>
          <p>
            <b>{t("admin.email")}:</b> {b.email}
          </p>
          <p>
            <b>{t("admin.phone")}:</b> {b.phone}
          </p>

          <p>
            <b>{t("admin.language")}:</b>{" "}
            {b.locale === "fr"
              ? t("admin.languageFrench")
              : b.locale === "en"
              ? t("admin.languageEnglish")
              : t("admin.languageRussian")}
          </p>

          {type === "standard" && (
            <>
              <p>
                <b>{t("admin.from")}:</b> {b.from}
              </p>
              <p>
                <b>{t("admin.to")}:</b> {b.to}
              </p>
              <p>
                <b>{t("admin.date")}:</b>{" "}
                {new Date(b.date).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                })}
              </p>
              {b.returnDate && (
                <p>
                  <b>{t("admin.returnDate")}:</b>{" "}
                  {new Date(b.returnDate).toLocaleString("fr-FR", {
                    timeZone: "Europe/Paris",
                  })}
                </p>
              )}
              <p>
                <b>{t("admin.adults")}:</b> {b.adults}
              </p>
              <p>
                <b>{t("admin.children")}:</b> {b.children}
              </p>
              <p>
                <b>{t("admin.baggage")}:</b>{" "}
                {b.baggage ? t("admin.yes") : t("admin.no")}
              </p>
              <p>
                <b>{t("admin.price")}:</b>{" "}
                {b.price ? `${b.price.toFixed(2)} €` : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.priceServer")}:</b>{" "}
                {b.priceServer
                  ? `${b.priceServer.toFixed(2)} €`
                  : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.comment")}:</b>{" "}
                {b.comment || t("admin.notSpecified")}
              </p>
            </>
          )}

          {type === "hourly" && (
            <>
              <p>
                <b>{t("admin.pickupLocation")}:</b> {b.pickupLocation}
              </p>
              <p>
                <b>{t("admin.date")}:</b>{" "}
                {new Date(b.date).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                })}
              </p>
              <p>
                <b>{t("admin.duration")}:</b>{" "}
                {b.duration
                  ? b.duration + " " + t("admin.hoursShort")
                  : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.price")}:</b>{" "}
                {b.totalPrice
                  ? `${b.totalPrice.toFixed(2)} €`
                  : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.priceServer")}:</b>{" "}
                {b.priceServer
                  ? `${b.priceServer.toFixed(2)} €`
                  : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.comment")}:</b>{" "}
                {b.tripPurpose || t("admin.notSpecified")}
              </p>
            </>
          )}
        </div>

        <div className="booking-actions">
          {!b.confirmed && (
            <button
              onClick={() => confirmBooking(b._id, type)}
              className="btn btn-confirm"
            >
              {t("admin.confirm")}
            </button>
          )}
          <button
            onClick={() => deleteBooking(b._id, type)}
            className="btn btn-delete"
          >
            {t("admin.delete")}
          </button>
        </div>
      </div>
    ));

  return (
    <div className="admin-container">
      <h1 className="admin-title">{t("admin.adminPanel")}</h1>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("standard")}
          className={`tab-button ${activeTab === "standard" ? "active" : ""} ${
            unconfirmedStandard > 0 ? "alert" : ""
          }`}
        >
          {t("admin.standardTrips")}
          {unconfirmedStandard > 0 && (
            <span className="tab-badge">{unconfirmedStandard}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("hourly")}
          className={`tab-button ${activeTab === "hourly" ? "active" : ""} ${
            unconfirmedHourly > 0 ? "alert" : ""
          }`}
        >
          {t("admin.hourlyRental")}
          {unconfirmedHourly > 0 && (
            <span className="tab-badge">{unconfirmedHourly}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`tab-button ${activeTab === "messages" ? "active" : ""} ${
            unrepliedMessages > 0 ? "alert" : ""
          }`}
        >
          {t("admin.messages")}
          {unrepliedMessages > 0 && (
            <span className="tab-badge">{unrepliedMessages}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
        >
          {t("admin.analytics")}
        </button>

        <button
          onClick={() => setActiveTab("drivers")}
          className={`tab-button ${activeTab === "drivers" ? "active" : ""}`}
        >
          {t("admin.drivers")}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
        >
          {t("admin.settings")}
        </button>
      </div>

      {activeTab === "standard" && (
        <div className="bookings-list">
          {standardBookings.length === 0 ? (
            <p className="no-bookings">{t("admin.noStandardTrips")}</p>
          ) : (
            renderBookingList(standardBookings, "standard")
          )}
        </div>
      )}

      {activeTab === "hourly" && (
        <div className="bookings-list">
          {hourlyBookings.length === 0 ? (
            <p className="no-bookings">{t("admin.noHourlyOrders")}</p>
          ) : (
            renderBookingList(hourlyBookings, "hourly")
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-bookings">{t("admin.noMessagesYet")}</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                id={msg._id}
                className={`booking-card ${msg.replied ? "replied" : ""}`}
              >
                <p>
                  <b>{t("admin.dateCreation")}:</b>{" "}
                  {new Date(msg.createdAt).toLocaleString("fr-FR", {
                    timeZone: "Europe/Paris",
                  })}
                </p>
                <p>
                  <b>{t("admin.name")}:</b> {msg.name}
                </p>
                <p>
                  <b>{t("admin.email")}:</b> {msg.email}
                </p>
                <p>
                  <b>{t("admin.messages")}:</b> {msg.message}
                </p>
                <p>
                  <b>{t("admin.language")}:</b>{" "}
                  {msg.locale === "fr"
                    ? t("admin.languageFrench")
                    : msg.locale === "en"
                    ? t("admin.languageEnglish")
                    : t("admin.languageRussian")}
                </p>
                {msg.replied && (
                  <span className="replied-text">
                    <p className="replied-label">{t("admin.replySent")}</p>
                  </span>
                )}
                <div className="booking-actions">
                  {!msg.replied && (
                    <button
                      onClick={() => replyMessage(msg._id)}
                      className="btn btn-confirm"
                    >
                      {t("admin.reply")}
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="btn btn-delete"
                  >
                    {t("admin.delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === "analytics" && (
        <div className="analytics-content">
          <h2>{t("admin.analytics")}</h2>
          <p>{t("admin.analyticsComingSoon")}</p>
          {/* Здесь можно отобразить графики, количество поездок, доход и т.п. */}
        </div>
      )}

      {activeTab === "settings" && settings && (
        <form onSubmit={handleSettingsSubmit} className="settings-form">
          <label>
            {t("admin.pricePerKm")}:
            <input
              type="number"
              step="0.01"
              value={settings.pricePerKm ?? ""}
              onChange={(e) => {
                updateSettings("pricePerKm", e.target.value);
              }}
              required
            />
          </label>
          <label>
            {t("admin.pricePerMin")}:
            <input
              type="number"
              step="0.01"
              min="1"
              max="2"
              value={settings.coefForRoundTrip}
              onChange={(e) =>
                updateSettings("coefForRoundTrip", e.target.value)
              }
              required
            />
          </label>
          <label>
            {t("admin.minFare")}:
            <input
              type="number"
              step="0.01"
              value={settings.minFare}
              onChange={(e) => updateSettings("minFare", e.target.value)}
              required
            />
          </label>
          <label>
            {t("admin.pricePerHour")}:
            <input
              type="number"
              step="0.01"
              value={settings.pricePerHour}
              onChange={(e) => updateSettings("pricePerHour", e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-save">
            {t("admin.save")}
          </button>
        </form>
      )}

      {activeTab === "drivers" && (
        <div className="drivers-content">
          <h2>{t("admin.drivers")}</h2>
          <p>{t("admin.driversComingSoon")}</p>
          {/* Список водителей, добавление, удаление, смена статуса */}
        </div>
      )}
    </div>
  );
}
