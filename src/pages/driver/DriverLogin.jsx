import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import '../../styles/Login.css';

export default function DriverLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backtest1-0501.onrender.com/api/login/driver', { email, password });
      localStorage.setItem('driverToken', res.data.driverToken);
      navigate('/login/driver/dashboard');
    } catch (err) {
      console.error(err);
      alert(t("adminLogin.error")); // Используем перевод для сообщения об ошибке
    }
  };

   return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 className="login-title">{t("adminLogin.title")}</h1>
        <input
          type="email"
          placeholder={t("adminLogin.email")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder={t("adminLogin.password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">{t("adminLogin.loginButton")}</button>
      </form>
    </div>
  );
}
