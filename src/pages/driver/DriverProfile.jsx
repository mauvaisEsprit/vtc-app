import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DriverProfile.css";
import { useTranslation } from "react-i18next";

export default function DriverProfile() {
  const { t } = useTranslation();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://backtest1-0501.onrender.com/api/driver/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDriver(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          // например, перенаправление:
          // navigate('/login');
        } else {
          console.error("Ошибка загрузки данных водителя", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  if (loading) {
    return <div className="driver-dashboard">Загрузка...</div>;
  }

  if (!driver) {
    return <div className="driver-dashboard">Ошибка загрузки данных</div>;
  }

  return (
    <div className="driver-dashboard">
      <div className="dashboard-card">
        <h1>{t("admin.welcome", { name: driver.name })}</h1>
        <p>
          <strong>{t("admin.email")}:</strong> {driver.email}
        </p>
        <p>
          <strong>{t("admin.phone")}:</strong> {driver.phone}
        </p>
        <p>
          <strong>{t("admin.experience")}:</strong> {driver.experience} лет
        </p>
        <p>
          <strong>{t("admin.city")}:</strong> {driver.city}
        </p>
        <p>
          <strong>{t("admin.vehicle")}:</strong> {driver.vehicle}
        </p>
        <p>
          <strong>{t("admin.licensePlate")}:</strong> {driver.licensePlate}
        </p>
        <p>
          <strong>{t("admin.role")}:</strong> {driver.role}
        </p>
        <p>
          <strong>{t("admin.createdAt")}:</strong>{" "}
          {new Date(driver.createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <p>
          <strong>{t("admin.updatedAt")}:</strong>{" "}
          {new Date(driver.updatedAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        
      </div>
    </div>
  );
}
