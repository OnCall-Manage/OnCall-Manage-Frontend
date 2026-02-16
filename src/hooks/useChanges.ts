import { useState, useEffect, useCallback } from "react";
import type {ChangeRequest} from "@/types/change";
import {
    getAllChanges,
    createChange,
    updateChange,
    deleteChange,
} from "@/services/changeService";

export function useChanges() {
    const [changes, setChanges] = useState<ChangeRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching changes from:", import.meta.env.VITE_API_URL || "http://localhost:3000/api");
            const data = await getAllChanges();
            setChanges(data);
            console.log("Changes loaded successfully:", data.length);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error desconocido";
            setError(message);
            console.error("Error loading changes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const create = useCallback(
        async (data: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">) => {
            try {
                console.log("useChanges: Creating change...");
                const result = await createChange(data);
                console.log("useChanges: Change created, reloading list...");
                await reload();
                console.log("useChanges: List reloaded");
                return result;
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error desconocido";
                setError(message);
                console.error("useChanges: Error creating change:", err);
                throw err;
            }
        },
        [reload]
    );

    const update = useCallback(
        async (id: string, data: Partial<Omit<ChangeRequest, "id" | "createdAt">>) => {
            try {
                console.log("useChanges: Updating change", id);
                const result = await updateChange(id, data);
                console.log("useChanges: Change updated, reloading list...");
                await reload();
                return result;
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error desconocido";
                setError(message);
                console.error("useChanges: Error updating change:", err);
                throw err;
            }
        },
        [reload]
    );

    const remove = useCallback(
        async (id: string) => {
            try {
                console.log("useChanges: Deleting change", id);
                const result = await deleteChange(id);
                console.log("useChanges: Change deleted, reloading list...");
                await reload();
                return result;
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error desconocido";
                setError(message);
                console.error("useChanges: Error deleting change:", err);
                throw err;
            }
        },
        [reload]
    );

    return { changes, loading, error, reload, create, update, remove };
}
