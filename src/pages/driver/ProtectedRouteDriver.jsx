import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('driverToken');
  return adminToken ? children : <Navigate to="/login/driver" replace />;
}

