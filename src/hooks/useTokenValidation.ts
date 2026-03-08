import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { handleSessionExpired } from "@/utils/sessionHandler";

export function useTokenValidation() {
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !token) {
            return;
        }

        const validationInterval = setInterval(() => {
            const storedToken = localStorage.getItem("auth_token");

            if (!storedToken) {
                handleSessionExpired();
                clearInterval(validationInterval);
            }
        }, 3600000);

        return () => clearInterval(validationInterval);
    }, [isAuthenticated, token]);
}

