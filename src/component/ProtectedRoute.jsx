import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
        return <Navigate to={user?.role === "recruiter" ? "/recruiterdashboard" : "/dashboard"} replace />;
    }

    return children;
}

export default ProtectedRoute
