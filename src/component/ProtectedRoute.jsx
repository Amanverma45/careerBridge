import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    
    // Safe Parse user object
    const user = (() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error("ProtectedRoute: user parse error:", e);
            return null;
        }
    })();

    if (!token || !user) {
        // Clear storage just in case of mismatch
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role || "user";

    if (role && userRole !== role) {
        return <Navigate to={userRole === "recruiter" ? "/recruiterdashboard" : "/dashboard"} replace />;
    }

    return children;
}

export default ProtectedRoute
