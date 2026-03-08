import { useMemo, useState } from "react";
import {type ChangeRequest, isCrossMidnight } from "@/types/change";
import { StatusBadge } from "@/components/StatusBadge";
import { ChangeTypeBadge } from "@/components/ChangeTypeBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { CHANGE_TYPES, CHANGE_STATUSES } from "@/types/change";

interface ChangeTableProps {
  changes: ChangeRequest[];
  onSelect: (change: ChangeRequest) => void;
}

export function ChangeTable({ changes, onSelect }: ChangeTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filtered = useMemo(() => {
    return changes.filter(c => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterType !== "all" && c.type !== filterType) return false;

      if (startDate && c.date < startDate) return false;
      if (endDate && c.date > endDate) return false;

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
  }, [changes, search, filterStatus, filterType, startDate, endDate]);

  return (
      <div className="space-y-4 animate-fade-in">
        <div className="space-y-3">
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

          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-muted-foreground block mb-1">From Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-muted-foreground block mb-1">To Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Clear Dates
              </Button>
            )}
          </div>
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
                <TableHead className="w-[130px]">Resolver</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">No changes found</TableCell>
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
                        <TableCell className="text-xs font-medium">{c.resolver}</TableCell>
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
