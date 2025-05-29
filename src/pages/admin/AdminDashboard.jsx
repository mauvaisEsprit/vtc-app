import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  }, []);

  const confirmBooking = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/admin/bookings/${id}/confirm`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, confirmed: true } : b));
  };

  const deleteBooking = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/admin/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Админ-панель</h1>
      {bookings.map(b => (
        <div key={b._id} className="border p-4 mb-2 rounded">
          <p><strong>От:</strong> {b.from}</p>
          <p><strong>До:</strong> {b.to}</p>
          <p><strong>Email:</strong> {b.email}</p>
          <p><strong>Статус:</strong> {b.confirmed ? '✅ Подтверждено' : '⏳ Не подтверждено'}</p>
          <div className="mt-2 space-x-2">
            {!b.confirmed && (
              <button
                onClick={() => confirmBooking(b._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Подтвердить
              </button>
            )}
            <button
              onClick={() => deleteBooking(b._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
