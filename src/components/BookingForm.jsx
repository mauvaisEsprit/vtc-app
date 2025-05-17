import { useState } from "react";
import "../styles/BookingForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingForm() {
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAdultsChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      const numVal = val === "" ? 0 : Number(val);
      const numChildren = children === "" ? 0 : Number(children);
      if (numVal + numChildren > 4) {
        setError("Trop de personnes! Maximum 4.");
      } else if (numVal < 1 && val !== "") {
        setError("Au moins 1 adulte est requis.");
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
        setError("Trop de personnes! Maximum 4.");
      } else {
        setError("");
        setChildren(val);
      }
    }
  };

  const formatDateParis = (date) => {
  // Опции для вывода в часовом поясе Парижа
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

  // Минимальное время — сейчас + 1 час
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000);

  // Для выбора минимального времени в react-datepicker в зависимости от выбранной даты
  const getMinTime = (date) => {
    if (!date) return new Date().setHours(0, 0, 0, 0);

    // Проверяем, совпадает ли выбранный день с днём minDateTime (сейчас + 1 час)
    if (
      date.getDate() === minDateTime.getDate() &&
      date.getMonth() === minDateTime.getMonth() &&
      date.getFullYear() === minDateTime.getFullYear()
    ) {
      return minDateTime;
    } else {
      // Для других дней минимальное время — с 00:00
      const midnight = new Date(date);
      midnight.setHours(0, 0, 0, 0);
      return midnight;
    }
  };

  // Максимальное время — 23:45 выбранного дня
  const getMaxTime = (date) => {
    if (!date) return new Date().setHours(23, 45, 0, 0);

    const maxTime = new Date(date);
    maxTime.setHours(23, 45, 0, 0);
    return maxTime;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) return; // не отправляем, если есть ошибка

    if (!selectedDate) {
      alert("Please select a date and time at least 1 hour from now.");
      return;
    }

    // Дополнительная проверка: выбранное время не раньше, чем через 1 час от текущего момента
    if (selectedDate < minDateTime) {
      alert("La date et l'heure doivent être au moins 1 heure après maintenant.");
      return;
    }

    const formData = new FormData(e.target);

    formData.set("date", formatDateParis(selectedDate));


    try {
      const response = await fetch("https://formspree.io/f/mgvalzay", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Merci ! Votre réservation a été envoyée.");

        setAdults("");
        setChildren("");
        setSelectedDate(null);
        e.target.reset();
      } else {
        alert("Erreur lors de l'envoi, veuillez réessayer plus tard.");
      }
    } catch {
      alert("Erreur réseau, veuillez réessayer plus tard.");
    }
  };

  


  return (
    <div className="booking-form-container">
      <section className="booking">
        <div className="text-booking">
          <p className="p1">PRÊT À VOYAGER AVEC STYLE?</p>
          <h2>Chauffeur Privé VTC 24/7</h2>
          <p className="p2">
            Réservez votre transfert privé VTC Nice en ligne 24h/7j.  Notre
            équipe dédiée assure un traitement rapide et soigné de chaque
            demande, pour un service de qualité qui s’adapte à vos besoins de
            transport sur toute la Côte d’Azur. Pour toute Réservation de
            chauffeur privé á Nice dans l’immédiat ou dans moins d’une heure
            merci de nous contacter directement par téléphone ou par whatsapp au
          </p>
          <a href="tel:+33622649963" className="numberTelephone">
            +33 6 22 64 99 63
          </a>
        </div>
      </section>
      
      <form className="booking-form" onSubmit={handleSubmit}>
        <label htmlFor="date" className="visually-hidden">
          Date
        </label>
        <DatePicker
          className="booking-datepicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeIntervals={15}
          minDate={minDateTime} // нельзя выбирать дату раньше чем сейчас + 1 час
          minTime={getMinTime(selectedDate)}
          maxTime={getMaxTime(selectedDate)}
          placeholderText="Select date and time *"
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          name="date"
          required
        />

        <input type="text" id="name" name="name" placeholder="Name *" required />

        <input
          type="number"
          id="adults"
          name="adults"
          min="1"
          max="4"
          placeholder="Adults *"
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
          placeholder="Children"
          value={children}
          onChange={handleChildrenChange}
        />

        {error && <p id="error-message" style={{ color: "red" }}>{error}</p>}

        <input type="tel" id="phone" name="phone" placeholder="Telephone *" required />

        <input type="email" id="email" name="email" placeholder="E-mail *" required />

        <input type="text" id="from" name="from" placeholder="From *" required />

        <input type="text" id="to" name="to" placeholder="To *" required />

        <div id="baggage-container">
          <label htmlFor="baggage">Baggage</label>{" "}
          <label className="switch">
            <input type="checkbox" id="baggage" name="baggage" />
            <span className="slider"></span>
          </label>
        </div>

        <textarea id="comment" name="comment" rows="3" placeholder="Comment"></textarea>

        <div id="garant-container">
          <input type="checkbox" id="garant" name="garant" required />
          <label htmlFor="garant">
            J'accepte que mes données soumises soient collectées et stockées.
          </label>
        </div>

        <button type="submit" disabled={!!error}>
          Book
        </button>
      </form>
    </div>
  );
}
