import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";

import '../../styles/AdminLogin.css'; // Подключаем CSS-файл

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backtest1-0501.onrender.com/api/login/admin', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/login/admin');
    } catch (err) {
      console.error(err);
      alert(t("adminLogin.error")); // Используем перевод для сообщения об ошибке
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h1 className="admin-login-title">{t("adminLogin.title")}</h1>
        <input
          type="email"
          placeholder={t("adminLogin.email")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="admin-login-input"
        />
        <input
          type="password"
          placeholder={t("adminLogin.password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="admin-login-input"
        />
        <button type="submit" className="admin-login-button">{t("adminLogin.loginButton")}</button>
      </form>
    </div>
  );
}
