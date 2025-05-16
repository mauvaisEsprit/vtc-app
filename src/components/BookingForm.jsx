import { useState, useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import "../styles/BookingForm.css";

export default function BookingForm() {
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
      <form
        className="booking-form"
        action="https://formspree.io/f/mgvalzay"
        method="POST"
      >
        <label htmlFor="name" className="visually-hidden">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name *"
          required
        />

        <label htmlFor="adults" className="visually-hidden">
          Adults
        </label>
        <input
          type="number"
          id="adults"
          name="adults"
          min="1"
          max="4"
          placeholder="Adults *"
          required
        />

        <label htmlFor="children" className="visually-hidden">
          Children
        </label>
        <input
          type="number"
          id="children"
          name="children"
          min="0"
          max="3"
          placeholder="Children *"
        />
        <p id="error-message" style={{ color: "red", display: "none" }}>
          Too many people! Max 4.
        </p>

        <label htmlFor="phone" className="visually-hidden">
          Telephone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Telephone *"
          required
        />

        <label htmlFor="email" className="visually-hidden">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="E-mail *"
          required
        />

        <label htmlFor="date" className="visually-hidden">
          Date
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          placeholder="Date *"
          required
        />

        <label htmlFor="from" className="visually-hidden">
          From
        </label>
        <input
          type="text"
          id="from"
          name="from"
          placeholder="From *"
          required
        />

        <label htmlFor="to" className="visually-hidden">
          To
        </label>
        <input type="text" id="to" name="to" placeholder="To *" required />

        <div id="baggage-container">
          <label htmlFor="baggage">Baggage</label>{" "}
          <label className="switch">
            <input type="checkbox" id="baggage" name="baggage" />
            <span className="slider"></span>
          </label>
        </div>

        <label htmlFor="comment" className="visually-hidden">
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows="3"
          placeholder="Comment"
        ></textarea>

        <div id="garant-container">
          <input type="checkbox" id="garant" name="garant" required />
          <label htmlFor="garant">
            J'accepte que mes données soumises soient collectées et stockées.
          </label>
        </div>

        <button type="submit">Book</button>
      </form>
    </div>
  );
}
