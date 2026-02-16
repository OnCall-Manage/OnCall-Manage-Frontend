import { Badge } from "@/components/ui/badge";
import type {ChangeType} from "@/types/change";
import { cn } from "@/lib/utils";

const typeStyles: Record<ChangeType, string> = {
    RFC: "bg-primary/15 text-primary border-primary/30",
    TK: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
    CRQ: "bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30",
};

export function ChangeTypeBadge({ type, className }: { type: ChangeType; className?: string }) {
    return (
        <Badge variant="outline" className={cn("font-mono text-xs font-semibold", typeStyles[type], className)}>
            {type}
        </Badge>
    );
}
