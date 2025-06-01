import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/DriverDashboard.css';

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const driverToken = localStorage.getItem('driverToken');
        console.log(driverToken);
        const res = await axios.get('https://backtest1-0501.onrender.com/api/driver/profile', {
          headers: {
            Authorization: `Bearer ${driverToken}`,
          },
        });
        console.log(driverToken);
        setDriver(res.data);
      } catch (err) {
  if (err.response?.status === 401 || err.response?.status === 403) {
    
    localStorage.removeItem('driverToken');
    // например, перенаправление:
    // navigate('/login');
  } else {
    console.error('Ошибка загрузки данных водителя', err);
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
        <h1>Добро пожаловать, {driver.name}!</h1>
        <p><strong>Email:</strong> {driver.email}</p>
        <p><strong>Телефон:</strong> {driver.phone}</p>
        <p><strong>Стаж:</strong> {driver.experience} лет</p>
        <p><strong>Город:</strong> {driver.city}</p>
        <div className="status">
          <strong>Статус:</strong> {driver.active ? '🟢 В сети' : '🔴 Не в сети'}
        </div>
      </div>
    </div>
  );
}
