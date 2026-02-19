import type { AuthResponse, LoginRequest } from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function handleResponse<T>(response: Response): Promise<T> {
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
        return handleResponse<AuthResponse>(response);
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

