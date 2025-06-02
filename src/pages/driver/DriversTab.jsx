import { useState, useEffect } from "react";
import axios from "axios";
import DriverRegister from "../admin/DriverRegister";
import "../../styles/DriversTab.css";

export default function DriversTab({ t }) {
  const [activeSubTab, setActiveSubTab] = useState("list"); // 'list' или 'register'

  return (
    <div className="drivers-content">
      <div className="drivers-tabs">
        <button
          className={activeSubTab === "list" ? "active" : ""}
          onClick={() => setActiveSubTab("list")}
        >
          {t("admin.driversList")}
        </button>
        <button
          className={activeSubTab === "register" ? "active" : ""}
          onClick={() => setActiveSubTab("register")}
        >
          {t("admin.driversRegister")}
        </button>
      </div>

      {activeSubTab === "list" && <DriversList t={t} />}
      {activeSubTab === "register" && <DriverRegister t={t} />}
    </div>
  );
}

// Компонент списка водителей с выбором и редактированием
function DriversList({ t }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://backtest1-0501.onrender.com/api/admin/drivers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDrivers(res.data);
      } catch (error) {
        console.error(error);
        alert(t("admin.errorLoadingDrivers"));
      }
    }
    fetchDrivers();
  }, [t]);

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setFormData(driver);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData(selectedDriver); // Сбросить изменения
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedDriver) return;
    try {
      const token = localStorage.getItem("token");
      const dataToSend = { ...formData, id: selectedDriver._id };

      await axios.put(
        `https://backtest1-0501.onrender.com/api/driver/update`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(t("admin.driverUpdated"));
      setDrivers(
        drivers.map((d) =>
          d._id === selectedDriver._id ? { ...d, ...formData } : d
        )
      );
      setSelectedDriver({ ...selectedDriver, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert(t("admin.errorUpdatingDriver"));
    }
  };

  const handleChangePassword = async () => {
    if (!selectedDriver) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://backtest1-0501.onrender.com/api/driver/admin-change-password`,
        {
          driverId: selectedDriver._id,
          newPassword: formData.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(t("admin.passwordChanged"));
    } catch (error) {
      console.error(error);
      alert(t("admin.errorChangingPassword"));
    }
  };

  const handleDelete = async () => {
    if (!selectedDriver) return;
    if (window.confirm(t("admin.confirmDeleteDriver"))) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://backtest1-0501.onrender.com/api/driver/${selectedDriver._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(t("admin.driverDeleted"));
        setDrivers(drivers.filter((d) => d._id !== selectedDriver._id));
        setSelectedDriver(null);
      } catch (error) {
        console.error(error);
        alert(t("admin.errorDeletingDriver"));
      }
    }
  };

  return (
    <div className="drivers-list-section">
      <div className="drivers-list">
        <h3>{t("admin.driversList")}</h3>
        <ul>
          {drivers.map((driver) => (
            <li
              key={driver._id}
              onClick={() => handleSelectDriver(driver)}
              style={{
                cursor: "pointer",
                fontWeight:
                  selectedDriver?._id === driver._id ? "bold" : "normal",
              }}
            >
              {driver.name} ({driver.email})
            </li>
          ))}
        </ul>
      </div>

      {selectedDriver && (
        <div className="driver-info-panel">
          <h3>{t("admin.driverDetails")}</h3>

          {!isEditing ? (
            <div className="driver-details">
              <p>
                <strong>{t("admin.name")}:</strong> {selectedDriver.name}
              </p>
              <p>
                <strong>{t("admin.email")}:</strong> {selectedDriver.email}
              </p>
              <p>
                <strong>{t("admin.phone")}:</strong> {selectedDriver.phone}
              </p>
              <p>
                <strong>{t("admin.city")}:</strong> {selectedDriver.city}
              </p>
              <p>
                <strong>{t("admin.experience")}:</strong>{" "}
                {selectedDriver.experience} {t("admin.years")}
              </p>
              <p>
                <strong>{t("admin.vehicle")}:</strong> {selectedDriver.vehicle}
              </p>
              <p>
                <strong>{t("admin.licensePlate")}:</strong>{" "}
                {selectedDriver.licensePlate}
              </p>
              <p>
                <strong>{t("admin.photoUrl")}: </strong>
                {t("admin.photoUrl")}
              </p>

              <button onClick={handleEdit}>{t("admin.edit")}</button>
            </div>
          ) : (
            <div className="driver-edit-form">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("admin.name")}
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("admin.email")}
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("admin.phone")}
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={t("admin.city")}
              />
              <input
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                placeholder={t("admin.experience")}
              />
              <input
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder={t("admin.vehicle")}
              />
              <input
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder={t("admin.licensePlate")}
              />
              <input
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder={t("admin.photoUrl")}
              />

              <div className="edit-buttons">
                <button className="saveDriverInfo" onClick={handleSave}>
                  {t("admin.save")}
                </button>
                <button className="cancelDriverInfo" onClick={handleCancel}>
                  {t("admin.cancel")}
                </button>
                <button className="deleteDriver" onClick={handleDelete}>
                  {t("admin.delete")}
                </button>
              </div>
              <div className="change-password">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("adminLogin.password")}
              />
              <button className="changePassword" onClick={handleChangePassword}>
                {t("admin.changePassword")}
              </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
