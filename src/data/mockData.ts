import type {ChangeRequest} from "@/types/change";

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const dayOffset = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return fmt(d);
};

export const MOCK_CHANGES: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">[] = [
    {
        type: "RFC",
        code: "200-11509",
        client: "Acme Corp",
        objective: "Oracle database patch upgrade to 19.22 on production cluster",
        status: "Pending",
        date: dayOffset(0),
        endDate: dayOffset(1), // crosses midnight
        startTime: "22:00",
        endTime: "02:00",
        notes: "Requires full backup before starting. Coordinate with storage team.",
        servers: [
            { hostname: "ora-prod-01", ip: "10.20.30.41" },
            { hostname: "ora-prod-02", ip: "10.20.30.42" },
        ],
        technology: "Oracle",
        resolver: "Carlos Mendez",
    },
    {
        type: "TK",
        code: "TK-88412",
        client: "GlobalBank",
        objective: "Investigate slow query performance on reporting database",
        status: "In Progress",
        date: dayOffset(0),
        startTime: "19:00",
        endTime: "21:00",
        notes: "User reported slowness during EOD batch. Check execution plans.",
        servers: [{ hostname: "sql-rpt-03", ip: "10.30.50.13" }],
        technology: "SQL Server",
        resolver: "Carlos Mendez",
    },
    {
        type: "CRQ",
        code: "CRQ-44201",
        client: "TechStart Inc",
        objective: "PostgreSQL replication setup for disaster recovery",
        status: "Pending",
        date: dayOffset(1),
        startTime: "01:00",
        endTime: "05:00",
        notes: "New standby node in DR site. Network team confirmed connectivity.",
        servers: [
            { hostname: "pg-primary-01", ip: "172.16.0.10" },
            { hostname: "pg-standby-dr", ip: "172.16.1.10" },
        ],
        technology: "PostgreSQL",
        resolver: "Ana Torres",
    },
    {
        type: "RFC",
        code: "200-11603",
        client: "MediCare Solutions",
        objective: "MongoDB cluster rolling restart after config changes",
        status: "Finished",
        date: dayOffset(-1),
        startTime: "03:00",
        endTime: "04:30",
        notes: "Completed successfully. All replica set members healthy.",
        servers: [
            { hostname: "mongo-rs1-a", ip: "10.50.1.11" },
            { hostname: "mongo-rs1-b", ip: "10.50.1.12" },
            { hostname: "mongo-rs1-c", ip: "10.50.1.13" },
        ],
        technology: "MongoDB",
        resolver: "Carlos Mendez",
    },
    {
        type: "TK",
        code: "TK-88500",
        client: "Acme Corp",
        objective: "Tablespace expansion for USERS tablespace reaching 95%",
        status: "Canceled",
        date: dayOffset(-2),
        endDate: dayOffset(-1), // crosses midnight
        startTime: "23:00",
        endTime: "00:30",
        notes: "Canceled — storage team unable to allocate LUNs in time.",
        servers: [{ hostname: "ora-prod-01", ip: "10.20.30.41" }],
        technology: "Oracle",
        resolver: "Carlos Mendez",
    },
    {
        type: "CRQ",
        code: "CRQ-44300",
        client: "GlobalBank",
        objective: "SQL Server Always On failover test",
        status: "Pending",
        date: dayOffset(2),
        startTime: "02:00",
        endTime: "04:00",
        notes: "Scheduled quarterly DR drill. Notify app team 30 min before.",
        servers: [
            { hostname: "sql-ag-01", ip: "10.30.50.20" },
            { hostname: "sql-ag-02", ip: "10.30.50.21" },
        ],
        technology: "SQL Server",
        resolver: "Ana Torres",
    },
];
