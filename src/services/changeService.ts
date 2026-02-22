import type {ChangeRequest} from "@/types/change";

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
    // Handle 401 Unauthorized - logout user
    if (response.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
        throw new Error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
    }

    if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
            const errorData = await response.json();

            if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                const messages = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
                if (messages) {
                    errorMessage = messages;
                }
            }
            else if (errorData.message) {
                errorMessage = errorData.message;
            }
            else if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch {
            try {
                const text = await response.text();
                if (text && text.length > 0) {
                    errorMessage = text.length > 200 ? text.substring(0, 200) : text;
                }
            } catch (e) {
                console.error("Failed to parse error response");
            }
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function getAllChanges(): Promise<ChangeRequest[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        return handleResponse<ChangeRequest[]>(response);
    } catch (error) {
        throw error;
    }
}

export async function getChangeById(id: string): Promise<ChangeRequest | undefined> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        return handleResponse<ChangeRequest>(response);
    } catch (error) {
        throw error;
    }
}

export async function createChange(data: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">): Promise<ChangeRequest> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await handleResponse<ChangeRequest>(response);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function updateChange(id: string, data: Partial<Omit<ChangeRequest, "id" | "createdAt">>): Promise<ChangeRequest | undefined> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<ChangeRequest>(response);
    } catch (error) {
        throw error;
    }
}

export async function deleteChange(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return true;
    } catch (error) {
        throw error;
    }
}

export async function getChangesByDate(date: string): Promise<ChangeRequest[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes?date=${date}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        return handleResponse<ChangeRequest[]>(response);
    } catch (error) {
        throw error;
    }
}

export async function getChangesByWeek(startDate: string): Promise<ChangeRequest[]> {
    try {
        const end = new Date(startDate);
        end.setDate(end.getDate() + 7);
        const endDateStr = end.toISOString().split("T")[0];
        const response = await fetch(`${API_BASE_URL}/changes?startDate=${startDate}&endDate=${endDateStr}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        return handleResponse<ChangeRequest[]>(response);
    } catch (error) {
        throw error;
    }
}
