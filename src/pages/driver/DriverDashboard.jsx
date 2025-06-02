import { useState } from "react";
import DriverProfile from "./DriverProfile";
import DriverTrips from "./DriverTrips"; // пустой пока
import { useTranslation } from "react-i18next";
import "../../styles/DriverDashboard.css";
import { useNavigate } from "react-router-dom";

export default function DriverDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="driver-dashboard">
      <div className="dashboard-tabs">
        <button
          className={activeTab === "profile" ? "active" : "not-active"}
          onClick={() => setActiveTab("profile")}
        >
          {t("admin.profile")}
        </button>
        <button
          className={activeTab === "trips" ? "active" : "not-active"}
          onClick={() => setActiveTab("trips")}
        >
          {t("admin.trips")}
        </button>
         <button
          className="logoutButton"
          onClick={handleLogout}
        >
          {t("admin.logout")}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "profile" && <DriverProfile />}
        {activeTab === "trips" && <DriverTrips />}
      </div>
    </div>
  );
}
