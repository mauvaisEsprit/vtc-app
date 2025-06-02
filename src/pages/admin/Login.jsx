import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import '../../styles/Login.css'; // Подключаем CSS-файл

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
    const { t } = useTranslation();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('https://backtest1-0501.onrender.com/api/login', {
      email,
      password,
    });

    const { token, role, /*name*/ } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);      // можно сохранить роль
    //localStorage.setItem('name', name);      // если хочешь отображать имя

    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'driver') {
      navigate('/driver/dashboard');
    } else {
      alert(t("adminLogin.unknownRole")); // если вдруг придёт неизвестная роль
    }

  } catch (err) {
    console.error(err);
    alert(t("adminLogin.error")); // сообщение об ошибке
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
