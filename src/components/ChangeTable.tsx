import { useMemo, useState } from "react";
import {type ChangeRequest, type ChangeStatus, isCrossMidnight } from "@/types/change";
import { StatusBadge } from "@/components/StatusBadge";
import { ChangeTypeBadge } from "@/components/ChangeTypeBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { CHANGE_TYPES, CHANGE_STATUSES } from "@/types/change";

interface ChangeTableProps {
  changes: ChangeRequest[];
  onSelect: (change: ChangeRequest) => void;
}

export function ChangeTable({ changes, onSelect }: ChangeTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = useMemo(() => {
    return changes.filter(c => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterType !== "all" && c.type !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.code.toLowerCase().includes(q) || c.client.toLowerCase().includes(q) || c.objective.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [changes, search, filterStatus, filterType]);

  return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code, client, or description..." className="pl-9" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {CHANGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {CHANGE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="w-[70px]">Type</TableHead>
                <TableHead className="w-[120px] font-mono">Code</TableHead>
                <TableHead className="w-[160px]">Client</TableHead>
                <TableHead className="hidden lg:table-cell">Objective</TableHead>
                <TableHead className="w-[140px]">Date</TableHead>
                <TableHead className="w-[120px]">Time</TableHead>
                <TableHead className="w-[100px]">Tech</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No changes found</TableCell>
                  </TableRow>
              ) : (
                  filtered.map(c => (
                      <TableRow key={c.id} onClick={() => onSelect(c)} className="cursor-pointer hover:bg-secondary/30 transition-colors">
                        <TableCell><ChangeTypeBadge type={c.type} /></TableCell>
                        <TableCell className="font-mono text-xs font-medium">{c.code}</TableCell>
                        <TableCell className="font-medium">{c.client}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm truncate max-w-[120px]">{c.objective}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {c.date}
                          {isCrossMidnight(c) && <span className="text-status-pending ml-1" title="Crosses midnight">→</span>}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{c.startTime}–{c.endTime}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.technology}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} of {changes.length} changes</p>
      </div>
  );
}
