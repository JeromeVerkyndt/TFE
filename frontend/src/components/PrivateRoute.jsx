// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;
    if (!user) return <Navigate to="/login" />;

    return children;
}
