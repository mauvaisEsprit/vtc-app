import "../styles/BookingForm.css";
import { useTranslation } from "react-i18next";

export default function TextHome() {
  const { t } = useTranslation();

  return (
    <div className="booking-form-container">
      <section className="booking">
        <div className="text-booking">
          <p className="p1">{t("form.ready")}</p>
          <h2>{t("form.title")}</h2>
          <p className="p2">{t("form.description")}</p>
          <a href="tel:+33622649963" className="numberTelephone">
            +33 6 22 64 99 63
          </a>
        </div>
      </section>
    </div>
  );
}
