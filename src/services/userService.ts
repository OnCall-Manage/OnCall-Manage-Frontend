import type { User } from "@/types/auth";
import { handleSessionExpired } from "@/utils/sessionHandler";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
}

function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    const token = getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
        throw new Error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
    }

    if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            const text = await response.text();
            if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        return handleResponse<User[]>(response);
    } catch (error) {
        throw error;
    }
}

export async function getUserById(id: string): Promise<User> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        return handleResponse<User>(response);
    } catch (error) {
        throw error;
    }
}

export async function createUser(
    data: Omit<User, "id"> & { password: string }
): Promise<User> {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<User>(response);
    } catch (error) {
        throw error;
    }
}

export async function updateUser(
    id: string,
    data: Partial<User>
): Promise<User> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<User>(response);
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
}

