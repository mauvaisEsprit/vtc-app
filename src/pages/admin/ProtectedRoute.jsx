import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? children : <Navigate to="/login" replace />;
}

