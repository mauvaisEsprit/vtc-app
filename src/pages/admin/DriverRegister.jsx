import { useState } from 'react';

export default function DriverRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    experience: '',
    vehicle: '',
    licensePlate: '',
    photoUrl: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem('adminToken');

    try {
      const res = await fetch('https://backtest1-0501.onrender.com/api/login/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Inscription réussie !');
        setForm({
          name: '', email: '', password: '', phone: '', city: '',
          experience: '', vehicle: '', licensePlate: '', photoUrl: ''
        });
      } else {
        setMessage(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error(error);
      setMessage('Erreur serveur');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" required />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="Ville" />
      <input name="experience" value={form.experience} onChange={handleChange} placeholder="Expérience" />
      <input name="vehicle" value={form.vehicle} onChange={handleChange} placeholder="Véhicule" />
      <input name="licensePlate" value={form.licensePlate} onChange={handleChange} placeholder="Plaque" />
      <input name="photoUrl" value={form.photoUrl} onChange={handleChange} placeholder="URL photo" />
      <button type="submit">S'inscrire</button>
      {message && <p>{message}</p>}
    </form>
  );
}
