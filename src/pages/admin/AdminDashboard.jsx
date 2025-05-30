import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("standard"); // 'messages', 'standard', 'hourly'
  const [standardBookings, setStandardBookings] = useState([]);
  const [hourlyBookings, setHourlyBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  const unconfirmedStandard = standardBookings.filter(b => !b.confirmed).length;
  const unconfirmedHourly = hourlyBookings.filter(b => !b.confirmed).length;
  const unrepliedMessages = messages.filter(m => !m.replied).length;

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Обычные поездки
    axios
      .get("https://backtest1-0501.onrender.com/api/bookings/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStandardBookings(res.data))
      .catch(console.error);

    // Почасовая аренда
    axios
      .get("https://backtest1-0501.onrender.com/api/hourly/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHourlyBookings(res.data))
      .catch(console.error);

    // Сообщения с сайта (если есть такая коллекция)
    axios
      .get("https://backtest1-0501.onrender.com/api/messages/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, []);

  const confirmBooking = async (id, type) => {
    const token = localStorage.getItem("token");
    const url =
      type === "hourly"
        ? `https://backtest1-0501.onrender.com/api/hourly/admin/${id}/confirm`
        : `https://backtest1-0501.onrender.com/api/bookings/admin/${id}/confirm`;

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
  };

  const deleteBooking = async (id, type) => {
    const card = document.getElementById(id);
    if (card) {
      card.classList.add("fade-out");
      setTimeout(async () => {
        const token = localStorage.getItem("token");
        const url =
          type === "hourly"
            ? `https://backtest1-0501.onrender.com/api/hourly/admin/${id}`
            : `https://backtest1-0501.onrender.com/api/bookings/admin/${id}`;

        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (type === "hourly") {
          setHourlyBookings((prev) => prev.filter((b) => b._id !== id));
        } else {
          setStandardBookings((prev) => prev.filter((b) => b._id !== id));
        }
      }, 500);
    }
  };

  const replyMessage = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://backtest1-0501.onrender.com/api/messages/admin/${id}/reply`,
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
    const card = document.getElementById(id);
    if (card) {
      card.classList.add("fade-out");
      setTimeout(async () => {
        const token = localStorage.getItem("token");
        try {
          await axios.delete(`https://backtest1-0501.onrender.com/api/messages/admin/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages((prev) => prev.filter((msg) => msg._id !== id));
        } catch (error) {
          console.error(error);
          alert(t("admin.errorDeletingMessage"));
        }
      }, 500);
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
            {b.locale === "fr" ? t("admin.languageFrench") : b.locale === "en" ? t("admin.languageEnglish") : t("admin.languageRussian")}
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
                <b>{t("admin.baggage")}:</b> {b.baggage ? t("admin.yes") : t("admin.no")}
              </p>
              <p>
                <b>{t("admin.price")}:</b>{" "}
                {b.price ? `${b.price.toFixed(2)} €` : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.comment")}:</b> {b.comment || t("admin.notSpecified")}
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
                {b.duration ? b.duration + " " + t("admin.hoursShort") : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.price")}:</b>{" "}
                {b.totalPrice ? `${b.totalPrice.toFixed(2)} €` : t("admin.notSpecified")}
              </p>
              <p>
                <b>{t("admin.comment")}:</b> {b.tripPurpose || t("admin.notSpecified")}
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
          {unconfirmedStandard > 0 && <span className="tab-badge">{unconfirmedStandard}</span>}
        </button>

        <button
          onClick={() => setActiveTab("hourly")}
          className={`tab-button ${activeTab === "hourly" ? "active" : ""} ${
            unconfirmedHourly > 0 ? "alert" : ""
          }`}
        >
          {t("admin.hourlyRental")}
          {unconfirmedHourly > 0 && <span className="tab-badge">{unconfirmedHourly}</span>}
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`tab-button ${activeTab === "messages" ? "active" : ""} ${
            unrepliedMessages > 0 ? "alert" : ""
          }`}
        >
          {t("admin.messages")}
          {unrepliedMessages > 0 && <span className="tab-badge">{unrepliedMessages}</span>}
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
                  <b>{t("admin.name")}:</b> {msg.name}
                </p>
                <p>
                  <b>{t("admin.email")}:</b> {msg.email}
                </p>
                <p>
                  <b>{t("admin.message")}:</b> {msg.message}
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
    </div>
  );
}

