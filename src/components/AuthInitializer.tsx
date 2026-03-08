import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthNavigate, useAuth } from "@/contexts/AuthContext";
import { useTokenValidation } from "@/hooks/useTokenValidation";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Usar el hook de validación de token
    useTokenValidation();

    useEffect(() => {
        setAuthNavigate((path: string) => navigate(path));

        (window as any).__navigate = (path: string) => navigate(path);

        // Escuchar evento de sesión expirada y redirigir
        const handleSessionExpired = () => {
            navigate("/login", { replace: true });
        };

        window.addEventListener("sessionExpired", handleSessionExpired);

        return () => {
            window.removeEventListener("sessionExpired", handleSessionExpired);
        };
    }, [navigate, logout]);

    return <>{children}</>;
}

