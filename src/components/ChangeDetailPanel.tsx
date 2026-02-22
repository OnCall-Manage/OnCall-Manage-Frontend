import {type ChangeRequest, isCrossMidnight, getEffectiveEndDate } from "@/types/change";
import { StatusBadge } from "@/components/StatusBadge";
import { ChangeTypeBadge } from "@/components/ChangeTypeBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Server, User, FileText, CalendarDays } from "lucide-react";

interface ChangeDetailPanelProps {
  change: ChangeRequest;
  onClose: () => void;
  onEdit: () => void;
}

export function ChangeDetailPanel({ change, onClose, onEdit }: ChangeDetailPanelProps) {
  const crossesMidnight = isCrossMidnight(change);
  const effectiveEndDate = getEffectiveEndDate(change);

  return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ChangeTypeBadge type={change.type} />
              <span className="font-mono font-semibold text-sm text-foreground">{change.code}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{change.client}</h3>
          </div>
          <StatusBadge status={change.status} />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{change.objective}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Schedule:</span>
            <span className="font-mono text-foreground">{change.startTime} – {change.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Resolver:</span>
            <span className="text-foreground">{change.resolver || "—"}</span>
          </div>
        </div>

        {crossesMidnight && (
            <div className="flex items-center gap-2 text-sm text-status-pending bg-status-pending/10 border border-status-pending/30 rounded-md px-3 py-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>Crosses midnight: <strong className="font-mono">{change.date}</strong> → <strong className="font-mono">{effectiveEndDate}</strong></span>
            </div>
        )}

        <Card className="bg-secondary/30 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Affected Servers ({change.servers.length})</span>
              <span className="text-xs text-muted-foreground ml-auto">{change.technology}</span>
            </div>
            <div className="space-y-1">
              {change.servers.map((s, i) => (
                  <div key={i} className="flex gap-4 text-xs font-mono text-muted-foreground">
                    <span className="text-foreground">{s.hostname}</span>
                    <span>{s.ipAddress}</span>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {change.notes && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Notes</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">{change.notes}</p>
            </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Close</button>
          <button onClick={onEdit} className="text-sm text-primary hover:underline font-medium">Edit Change</button>
        </div>
      </div>
  );
}
