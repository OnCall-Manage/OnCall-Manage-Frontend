export type ChangeType = "RFC" | "TK" | "CRQ";

export type ChangeStatus = "Pending" | "In Progress" | "Finished" | "Canceled";

export type Technology = "Oracle" | "SQL Server" | "PostgreSQL" | "MySQL" | "MongoDB" | "Redis" | "Other";

export interface AffectedServer {
    hostname: string;

    ipAddress: string;
}

export interface ChangeRequest {
    id: string;
    type: ChangeType;
    code: string;
    client: string;
    objective: string;
    status: ChangeStatus;
    date: string; // ISO date string YYYY-MM-DD (start date)
    endDate?: string; // ISO date string YYYY-MM-DD (end date, for cross-midnight changes)
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    notes: string;
    servers: AffectedServer[];
    technology: Technology;
    resolver: string;
    createdAt: string;
    updatedAt: string;
}

export const CHANGE_TYPES: ChangeType[] = ["RFC", "TK", "CRQ"];
export const CHANGE_STATUSES: ChangeStatus[] = ["Pending", "In Progress", "Finished", "Canceled"];
export const TECHNOLOGIES: Technology[] = ["Oracle", "SQL Server", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Other"];

export const STATUS_COLORS: Record<ChangeStatus, string> = {
    Pending: "status-pending",
    "In Progress": "status-in-progress",
    Finished: "status-finished",
    Canceled: "status-canceled",
};

/** Check if a change crosses midnight (endTime < startTime) */
export function isCrossMidnight(change: ChangeRequest): boolean {
    return change.endTime < change.startTime;
}

/** Compute the effective end date for a change */
export function getEffectiveEndDate(change: ChangeRequest): string {
    if (change.endDate) return change.endDate;
    if (isCrossMidnight(change)) {
        const d = new Date(change.date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }
    return change.date;
}
