import type {ChangeStatus, STATUS_COLORS} from "@/types/change";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: ChangeStatus;
    className?: string;
}

const statusStyles: Record<ChangeStatus, string> = {
    Pending: "bg-status-pending/15 text-status-pending border-status-pending/30",
    "In Progress": "bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30",
    Finished: "bg-status-finished/15 text-status-finished border-status-finished/30",
    Canceled: "bg-status-canceled/15 text-status-canceled border-status-canceled/30",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <Badge variant="outline" className={cn("font-medium text-xs", statusStyles[status], className)}>
            {status}
        </Badge>
    );
}
