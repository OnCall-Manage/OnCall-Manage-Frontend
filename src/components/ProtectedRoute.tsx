import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { handleSessionExpired } from "@/utils/sessionHandler";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "USER";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();

    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        if (!storedToken && isAuthenticated) {
            handleSessionExpired();
        }
    }, [isAuthenticated, storedToken]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg font-semibold">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

