import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthContextType, User } from "@/types/auth";
import { login as loginService } from "@/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load stored auth data on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        console.log("🔍 AuthContext: Restaurando sesión...");
        console.log("Token almacenado:", storedToken ? "✓ Existe" : "✗ No existe");
        console.log("Usuario almacenado:", storedUser ? "✓ Existe" : "✗ No existe");

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log("✅ Usuario parseado correctamente:", parsedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error("❌ Error al parsear usuario:", error);
                console.log("Datos corruptos detectados, limpiando localStorage...");
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        } else {
            console.log("⚠️ No hay sesión almacenada");
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(
        async (username: string, password: string) => {
            setIsLoading(true);
            try {
                const response = await loginService({ username, password });

                const { token: newToken, user: newUser } = response;

                if (!newToken || !newUser) {
                    throw new Error("Token o usuario no recibidos del servidor");
                }

                // Validar que el usuario tenga las propiedades necesarias
                if (!newUser.id || !newUser.username) {
                    throw new Error("Usuario incompleto. Falta 'id' o 'username'");
                }

                setToken(newToken);
                setUser(newUser);

                localStorage.setItem(TOKEN_KEY, newToken);
                localStorage.setItem(USER_KEY, JSON.stringify(newUser));

                console.log("✅ Sesión iniciada correctamente");
            } catch (error) {
                console.error("❌ Error en login:", error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

