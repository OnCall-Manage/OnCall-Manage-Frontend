import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { validateToken } from "@/services/authService";

/**
 * Hook que valida periódicamente si el token sigue siendo válido en el backend.
 */
export function useTokenValidation() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const validationInterval = setInterval(async () => {
            const isValid = await validateToken();
            if (!isValid) {
                clearInterval(validationInterval);
            }
        }, 1800000);

        return () => clearInterval(validationInterval);
    }, [isAuthenticated]);
}

