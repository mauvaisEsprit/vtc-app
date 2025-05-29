import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../../components/Hero';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('"https://backtest1-0501.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Ошибка входа');
    }
  };

  return (
    <div>
    <Hero />
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Вход администратора</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Войти</button>
    </form>
    </div>
  );
}
