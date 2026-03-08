import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthNavigate, useAuth } from "@/contexts/AuthContext";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        setAuthNavigate((path: string) => navigate(path));

        (window as any).__navigate = (path: string) => navigate(path);
    }, [navigate, logout]);

    return <>{children}</>;
}

