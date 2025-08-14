import { Navigate } from 'react-router-dom';

function RoleRoute({ children, allowedRoles, user }) {
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default RoleRoute;
