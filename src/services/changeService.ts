import type {ChangeRequest} from "@/types/change";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiError {
    error?: string;
    message?: string;
    [key: string]: unknown;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
            const errorData = await response.json();
            console.error("❌ Backend Error Response:", errorData);

            // Si es un objeto con campos de validación
            if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                const messages = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
                if (messages) {
                    errorMessage = messages;
                }
            }
            // Si tiene un mensaje directo
            else if (errorData.message) {
                errorMessage = errorData.message;
            }
            // Si tiene un error directo
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
                // Ignorar si no se puede parsear
            }
        }
        console.error("❌ Final Error Message:", errorMessage);
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function getAllChanges(): Promise<ChangeRequest[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return handleResponse<ChangeRequest[]>(response);
    } catch (error) {
        console.error("Failed to fetch changes:", error);
        throw error;
    }
}

export async function getChangeById(id: string): Promise<ChangeRequest | undefined> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return handleResponse<ChangeRequest>(response);
    } catch (error) {
        console.error("Failed to fetch change:", error);
        throw error;
    }
}

export async function createChange(data: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">): Promise<ChangeRequest> {
    try {
        console.log("🔹 createChange: Enviando datos al backend:", {
            type: data.type,
            code: data.code,
            client: data.client,
            objective: data.objective,
            status: data.status,
            date: data.date,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            resolver: data.resolver,
            technology: data.technology,
            servers: data.servers,
            notes: data.notes,
        });

        const response = await fetch(`${API_BASE_URL}/changes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        console.log("🔹 createChange: Response Status =", response.status);
        const result = await handleResponse<ChangeRequest>(response);
        console.log("✅ createChange: Success! Change created:", result);
        return result;
    } catch (error) {
        console.error("❌ createChange: Failed:", error);
        throw error;
    }
}

export async function updateChange(id: string, data: Partial<Omit<ChangeRequest, "id" | "createdAt">>): Promise<ChangeRequest | undefined> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return handleResponse<ChangeRequest>(response);
    } catch (error) {
        console.error("Failed to update change:", error);
        throw error;
    }
}

export async function deleteChange(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Failed to delete change:", error);
        throw error;
    }
}

export async function getChangesByDate(date: string): Promise<ChangeRequest[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/changes?date=${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return handleResponse<ChangeRequest[]>(response);
    } catch (error) {
        console.error("Failed to fetch changes by date:", error);
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
            headers: {
                "Content-Type": "application/json",
            },
        });
        return handleResponse<ChangeRequest[]>(response);
    } catch (error) {
        console.error("Failed to fetch changes by week:", error);
        throw error;
    }
}
