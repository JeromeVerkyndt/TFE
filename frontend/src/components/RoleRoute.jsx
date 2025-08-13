import { Navigate } from 'react-router-dom';

function RoleRoute({ children, allowedRoles, user }) {
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" replace />;
    }
    return children;
}

export default RoleRoute;
