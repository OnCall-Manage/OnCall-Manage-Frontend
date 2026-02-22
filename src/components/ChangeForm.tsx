import { useState } from "react";
import {
  type ChangeRequest, type ChangeType, type ChangeStatus, type Technology, type AffectedServer, CHANGE_TYPES, CHANGE_STATUSES, TECHNOLOGIES } from "@/types/change";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X, AlertTriangle } from "lucide-react";

interface ChangeFormProps {
  initialData?: ChangeRequest;
  onSubmit: (data: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function ChangeForm({ initialData, onSubmit, onCancel }: ChangeFormProps) {
  const [type, setType] = useState<ChangeType>(initialData?.type || "RFC");
  const [code, setCode] = useState(initialData?.code || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [objective, setObjective] = useState(initialData?.objective || "");
  const [status, setStatus] = useState<ChangeStatus>(initialData?.status || "Pending");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [servers, setServers] = useState<AffectedServer[]>(initialData?.servers || [{ hostname: "", ipAddress: "" }]);
  const [technology, setTechnology] = useState<Technology>(initialData?.technology || "Oracle");
  const [resolver, setResolver] = useState(initialData?.resolver || "");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-compute endDate for cross-midnight changes
  const crossesMidnight = startTime && endTime && endTime < startTime;
  const computedEndDate = crossesMidnight
      ? (() => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
      })()
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!code.trim()) {
      setValidationError("Change Code is required");
      return;
    }
    if (!client.trim()) {
      setValidationError("Client is required");
      return;
    }
    if (!objective.trim()) {
      setValidationError("Objective is required");
      return;
    }
    if (!startTime) {
      setValidationError("Start Time is required");
      return;
    }
    if (!endTime) {
      setValidationError("End Time is required");
      return;
    }
    if (!resolver.trim()) {
      setValidationError("Resolver is required");
      return;
    }

    const validServers = servers.filter(s => s.hostname.trim() && s.ipAddress.trim());

    if (validServers.length === 0) {
      setValidationError("At least one server with hostname and IP is required");
      return;
    }

    const submitData = {
      type,
      code,
      client,
      objective,
      status,
      date,
      endDate: computedEndDate || date,
      startTime,
      endTime,
      notes: notes || " ",
      servers: validServers,
      technology,
      resolver,
    };

    console.log("🔸 ChangeForm: Submitting data:", submitData);
    onSubmit(submitData);
  };

  const addServer = () => setServers([...servers, { hostname: "", ipAddress: "" }]);
  const removeServer = (i: number) => setServers(servers.filter((_, idx) => idx !== i));
  const updateServer = (i: number, field: keyof AffectedServer, value: string) => {
    const updated = [...servers];
    updated[i] = { ...updated[i], [field]: value };
    setServers(updated);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        {validationError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Change Type</Label>
            <Select value={type} onValueChange={(v: string) => setType(v as ChangeType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHANGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Change Code</Label>
            <Input value={code} onChange={e => setCode(e.target.value)} placeholder=" " className="font-mono" required />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ChangeStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHANGE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={client} onChange={e => setClient(e.target.value)} placeholder="Client name" required />
          </div>
          <div className="space-y-2">
            <Label>Resolver / Responsible</Label>
            <Input value={resolver} onChange={e => setResolver(e.target.value)} placeholder="Assigned person" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Objective / Description</Label>
          <Textarea value={objective} onChange={e => setObjective(e.target.value)} placeholder="Describe the change..." rows={3} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Technology</Label>
            <Select value={technology} onValueChange={(v) => setTechnology(v as Technology)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TECHNOLOGIES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {crossesMidnight && (
            <div className="flex items-center gap-2 text-sm text-status-pending bg-status-pending/10 border border-status-pending/30 rounded-md px-3 py-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>This change crosses midnight. It will span from <strong>{date}</strong> to <strong>{computedEndDate}</strong>.</span>
            </div>
        )}

        <Card className="border-border bg-secondary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Affected Servers</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={addServer}>
                <Plus className="h-4 w-4 mr-1" /> Add Server
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {servers.map((server, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={server.hostname} onChange={e => updateServer(i, "hostname", e.target.value)} placeholder="Hostname" className="font-mono text-sm" />
                  <Input value={server.ipAddress} onChange={e => updateServer(i, "ipAddress", e.target.value)} placeholder="IP Address" className="font-mono text-sm" />
                  {servers.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeServer(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  )}
                </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label>Notes / Comments</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Change" : "Create Change"}
          </Button>
        </div>
      </form>
  );
}
