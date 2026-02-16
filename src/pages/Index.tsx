import { useState } from "react";
import type {ChangeRequest} from "@/types/change";
import { useChanges } from "@/hooks/useChanges";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { ChangeTable } from "@/components/ChangeTable";
import { ChangeForm } from "@/components/ChangeForm";
import { ChangeDetailPanel } from "@/components/ChangeDetailPanel";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Calendar, List } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
    const { changes, create, update, remove } = useChanges();
    const [selectedChange, setSelectedChange] = useState<ChangeRequest | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingChange, setEditingChange] = useState<ChangeRequest | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ChangeRequest | null>(null);
    const [weekStart, setWeekStart] = useState(new Date());

    const handleCreate = async (data: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">) => {
        try {
            console.log("🔵 Index.handleCreate: Starting...");
            await create(data);
            console.log("✅ Index.handleCreate: Success!");
            setShowForm(false);
            toast.success("Change created successfully");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error creating change";
            console.error("❌ Index.handleCreate Error:", message);
            toast.error(message);
        }
    };

    const handleUpdate = async (data: Omit<ChangeRequest, "id" | "createdAt" | "updatedAt">) => {
        if (!editingChange) return;
        try {
            await update(editingChange.id, data);
            setEditingChange(null);
            setSelectedChange(null);
            toast.success("Change updated");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error updating change";
            toast.error(message);
            console.error("Update error:", err);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await remove(deleteTarget.id);
            setDeleteTarget(null);
            setSelectedChange(null);
            toast.success("Change deleted");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error deleting change";
            toast.error(message);
            console.error("Delete error:", err);
        }
    };

    const stats = {
        total: changes.length,
        pending: changes.filter(c => c.status === "Pending").length,
        inProgress: changes.filter(c => c.status === "In Progress").length,
        finished: changes.filter(c => c.status === "Finished").length,
    };

    return (
        <AppLayout
            stats={
                <div className="hidden md:flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">Total: <strong className="text-foreground">{stats.total}</strong></span>
                    <span className="text-status-pending">Pending: <strong>{stats.pending}</strong></span>
                    <span className="text-status-in-progress">Active: <strong>{stats.inProgress}</strong></span>
                    <span className="text-status-finished">Done: <strong>{stats.finished}</strong></span>
                </div>
            }
            headerActions={
                <Button size="sm" onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-1" /> New Change
                </Button>
            }
        >
            <Tabs defaultValue="calendar" className="space-y-4">
                <TabsList className="bg-secondary/50">
                    <TabsTrigger value="calendar" className="gap-1.5"><Calendar className="h-4 w-4" /> Calendar</TabsTrigger>
                    <TabsTrigger value="list" className="gap-1.5"><List className="h-4 w-4" /> Change Log</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                    <WeeklyCalendar
                        changes={changes}
                        onSelectChange={setSelectedChange}
                        weekStart={weekStart}
                        onWeekChange={setWeekStart}
                    />
                </TabsContent>

                <TabsContent value="list">
                    <ChangeTable changes={changes} onSelect={setSelectedChange} />
                </TabsContent>
            </Tabs>

            {/* Detail Dialog */}
            <Dialog open={!!selectedChange && !editingChange} onOpenChange={(o) => !o && setSelectedChange(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Change Details</DialogTitle>
                    </DialogHeader>
                    {selectedChange && (
                        <div className="space-y-4">
                            <ChangeDetailPanel
                                change={selectedChange}
                                onClose={() => setSelectedChange(null)}
                                onEdit={() => setEditingChange(selectedChange)}
                            />
                            <div className="flex justify-between pt-2 border-t border-border">
                                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(selectedChange)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create / Edit Dialog */}
            <Dialog open={showForm || !!editingChange} onOpenChange={(o) => { if (!o) { setShowForm(false); setEditingChange(null); } }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingChange ? "Edit Change" : "New Change Request"}</DialogTitle>
                    </DialogHeader>
                    <ChangeForm
                        initialData={editingChange || undefined}
                        onSubmit={editingChange ? handleUpdate : handleCreate}
                        onCancel={() => { setShowForm(false); setEditingChange(null); }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Change?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <span className="font-mono font-semibold">{deleteTarget?.code}</span>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default Index;
