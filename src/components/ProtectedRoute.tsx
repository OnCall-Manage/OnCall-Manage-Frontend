import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "USER";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading, token } = useAuth();

    console.log("🔐 ProtectedRoute - Estado:", {
        isLoading,
        isAuthenticated,
        user: user ? { username: user.username, role: user.role } : null,
        hasToken: !!token,
        requiredRole,
    });

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
        console.log("❌ No autenticado - Redirigiendo a /login");
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        console.log("❌ Rol insuficiente - Redirigiendo a /");
        return <Navigate to="/" replace />;
    }

    console.log("✅ Usuario autenticado - Mostrando contenido");
    return <>{children}</>;
}

