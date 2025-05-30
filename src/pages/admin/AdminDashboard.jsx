import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("standard"); // 'messages', 'standard', 'hourly'
  const [standardBookings, setStandardBookings] = useState([]);
  const [hourlyBookings, setHourlyBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Обычные поездки
    axios
      .get("http://localhost:3001/api/bookings/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStandardBookings(res.data))
      .catch(console.error);

    // Почасовая аренда
    axios
      .get("http://localhost:3001/api/hourly/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHourlyBookings(res.data))
      .catch(console.error);

    // Сообщения с сайта (если есть такая коллекция)
    axios
      .get("http://localhost:3001/api/messages/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, []);

  const confirmBooking = async (id, type) => {
    const token = localStorage.getItem("token");
    const url =
      type === "hourly"
        ? `http://localhost:3001/api/hourly/admin/${id}/confirm`
        : `http://localhost:3001/api/bookings/admin/${id}/confirm`;

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
    const token = localStorage.getItem("token");
    const url =
      type === "hourly"
        ? `http://localhost:3001/api/hourly/admin/${id}`
        : `http://localhost:3001/api/bookings/admin/${id}`;

    await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (type === "hourly") {
      setHourlyBookings((prev) => prev.filter((b) => b._id !== id));
    } else {
      setStandardBookings((prev) => prev.filter((b) => b._id !== id));
    }
  };

  const replyMessage = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:3001/api/messages/admin/${id}/reply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Письмо клиенту отправлено");

      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, replied: true } : msg))
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке письма");
    }
  };

  const deleteMessage = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3001/api/messages/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении сообщения");
    }
  };

  const renderBookingList = (bookings, type) =>
    bookings.map((b) => (
      <div
        key={b._id}
        className={`booking-card ${b.confirmed ? "confirmed" : "pending"}`}
      >
        <div className="booking-header">
          <h2>
            Номер бронирования:{" "}
            <span className="booking-id">{b.bookingNumber}</span>
          </h2>
          <span
            className={`status-badge ${
              b.confirmed ? "status-confirmed" : "status-pending"
            }`}
          >
            {b.confirmed ? "Подтверждено" : "Не подтверждено"}
          </span>
        </div>

        <div className="booking-info">
          <p>
            <b>Имя:</b> {b.name}
          </p>
          <p>
            <b>Email:</b> {b.email}
          </p>
          <p>
            <b>Телефон:</b> {b.phone}
          </p>

          {type === "standard" && (
            <>
              <p>
                <b>Откуда:</b> {b.from}
              </p>
              <p>
                <b>Куда:</b> {b.to}
              </p>
              <p>
                <b>Дата:</b>{" "}
                {new Date(b.date).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                })}
              </p>
              {b.returnDate && (
                <p>
                  <b>Дата возврата:</b>{" "}
                  {new Date(b.returnDate).toLocaleString("fr-FR", {
                    timeZone: "Europe/Paris",
                  })}
                </p>
              )}
              <p>
                <b>Взрослые:</b> {b.adults}
              </p>
              <p>
                <b>Дети:</b> {b.children}
              </p>
              <p>
                <b>Багаж:</b> {b.baggage ? "Есть" : "Нет"}
              </p>
              <p>
                <b>Цена:</b>{" "}
                {b.price ? `${b.price.toFixed(2)} €` : "не указано"}
              </p>
              <p>
                <b>Комментарий:</b> {b.comment || "не указано"}
              </p>
            </>
          )}

          {type === "hourly" && (
            <>
              <p>
                <b>Место подачи:</b> {b.pickupLocation}
              </p>
              <p>
                <b>Дата:</b>{" "}
                {new Date(b.date).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                })}
              </p>
              <p>
                <b>Продолжительность:</b>{" "}
                {b.duration ? b.duration + " ч." : "не указано"}
              </p>
              <p>
                <b>Цена:</b>{" "}
                {b.totalPrice ? `${b.totalPrice.toFixed(2)} €` : "не указано"}
              </p>
              <p>
                <b>Комментарий:</b> {b.tripPurpose || "не указано"}
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
              Подтвердить
            </button>
          )}
          <button
            onClick={() => deleteBooking(b._id, type)}
            className="btn btn-delete"
          >
            Удалить
          </button>
        </div>
      </div>
    ));

  return (
    <div className="admin-container">
      <h1 className="admin-title">Админ-панель</h1>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("standard")}
          className={activeTab === "standard" ? "active" : ""}
        >
          Обычные поездки
        </button>
        <button
          onClick={() => setActiveTab("hourly")}
          className={activeTab === "hourly" ? "active" : ""}
        >
          Почасовая аренда
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={activeTab === "messages" ? "active" : ""}
        >
          Сообщения
        </button>
      </div>

      {activeTab === "standard" && (
        <div className="bookings-list">
          {standardBookings.length === 0 ? (
            <p className="no-bookings">Нет обычных поездок...</p>
          ) : (
            renderBookingList(standardBookings, "standard")
          )}
        </div>
      )}

      {activeTab === "hourly" && (
        <div className="bookings-list">
          {hourlyBookings.length === 0 ? (
            <p className="no-bookings">Нет почасовых заказов...</p>
          ) : (
            renderBookingList(hourlyBookings, "hourly")
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-bookings">Сообщений пока нет...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`booking-card ${msg.replied ? "replied" : ""}`}
              >
                <p>
                  <b>Имя:</b> {msg.name}
                </p>
                <p>
                  <b>Email:</b> {msg.email}
                </p>
                <p>
                  <b>Сообщение:</b> {msg.message}
                </p>
                {msg.replied && (
                  <span className="replied-text"><p className="replied-label">Ответ отправлен</p></span>
                )}
                <div className="booking-actions">
                  {!msg.replied && (
                    <button
                      onClick={() => replyMessage(msg._id)}
                      className="btn btn-confirm"
                    >
                      Ответить
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="btn btn-delete"
                  >
                    Удалить
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
