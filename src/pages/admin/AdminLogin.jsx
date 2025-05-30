import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../styles/AdminLogin.css'; // Подключаем CSS-файл

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/admin', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Ошибка входа');
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h1 className="admin-login-title">Вход администратора</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="admin-login-input"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="admin-login-input"
        />
        <button type="submit" className="admin-login-button">Войти</button>
      </form>
    </div>
  );
}
