// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PrivateRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
