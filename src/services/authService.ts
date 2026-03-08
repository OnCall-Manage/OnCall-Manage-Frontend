import type { AuthResponse, LoginRequest } from "@/types/auth";
import { handleSessionExpired } from "@/utils/sessionHandler";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
        handleSessionExpired();
        throw new Error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
    }

    if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch {
            try {
                const text = await response.text();
                if (text && text.length > 0) {
                    errorMessage = text.length > 200 ? text.substring(0, 200) : text;
                }
            } catch (e) {
                console.error("Failed to parse error response:", e);
            }
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });


        const result = await handleResponse<any>(response);

        let normalizedResponse: AuthResponse;

        if (result.user && typeof result.user === 'object') {
            const userObj = result.user;
            normalizedResponse = {
                token: result.token,
                user: {
                    id: userObj.id || userObj.userId,
                    username: userObj.username,
                    nombre: userObj.nombre || userObj.name || userObj.firstName,
                    apellido: userObj.apellido || userObj.lastName || userObj.Apellido,
                    email: userObj.email,
                    puesto: userObj.puesto || userObj.position,
                    role: userObj.role || "USER",
                }
            };
            console.log("✅ Normalizado a:", normalizedResponse);
        } else if (result.username && result.token) {
            const userId = result.userid || result.id || result.userId || "unknown";
            normalizedResponse = {
                token: result.token,
                user: {
                    id: userId,
                    username: result.username,
                    nombre: result.nombre,
                    apellido: result.apellido,
                    email: result.email,
                    puesto: result.puesto,
                    role: result.role || "USER",
                },
            };
        } else {
            console.error("❌ Estructura de respuesta no válida");
            throw new Error("Estructura de respuesta no reconocida");
        }

        console.log("✅ Login exitoso");
        return normalizedResponse;
    } catch (error) {
        console.error("❌ Login fallido");
        throw error;
    }
}

