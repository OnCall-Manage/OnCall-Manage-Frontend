import { useMemo } from "react";
import {type ChangeRequest, type ChangeStatus, isCrossMidnight, getEffectiveEndDate } from "@/types/change";
import { ChangeTypeBadge } from "@/components/ChangeTypeBadge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
    changes: ChangeRequest[];
    onSelectChange: (change: ChangeRequest) => void;
    weekStart: Date;
    onWeekChange: (date: Date) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_HEIGHT = 48; // px per hour

function getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

function formatDateShort(d: Date): string {
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

function parseTime(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
}

function formatHour(h: number): string {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const statusColors: Record<ChangeStatus, { bg: string; border: string; hover: string }> = {
    Pending: {
        bg: "bg-status-pending/15",
        border: "border-status-pending/60",
        hover: "hover:bg-status-pending/25",
    },
    "In Progress": {
        bg: "bg-status-in-progress/15",
        border: "border-status-in-progress/60",
        hover: "hover:bg-status-in-progress/25",
    },
    Finished: {
        bg: "bg-status-finished/15",
        border: "border-status-finished/60",
        hover: "hover:bg-status-finished/25",
    },
    Canceled: {
        bg: "bg-status-canceled/15",
        border: "border-status-canceled/60",
        hover: "hover:bg-status-canceled/25",
    },
};

/** A calendar entry representing a change on a specific day */
interface CalendarEntry {
    change: ChangeRequest;
    startHour: number;
    endHour: number;
    isContinuation: boolean;
    continuesNextDay: boolean;
}

/** Entry with computed column layout */
interface LayoutEntry extends CalendarEntry {
    column: number;
    totalColumns: number;
}

function getEntriesForDate(changes: ChangeRequest[], dateStr: string): CalendarEntry[] {
    const entries: CalendarEntry[] = [];

    for (const c of changes) {
        const crossesMidnight = isCrossMidnight(c);
        const effectiveEndDate = getEffectiveEndDate(c);

        if (c.date === dateStr) {
            if (crossesMidnight) {
                entries.push({
                    change: c,
                    startHour: parseTime(c.startTime),
                    endHour: 24,
                    isContinuation: false,
                    continuesNextDay: true,
                });
            } else {
                entries.push({
                    change: c,
                    startHour: parseTime(c.startTime),
                    endHour: parseTime(c.endTime),
                    isContinuation: false,
                    continuesNextDay: false,
                });
            }
        }

        if (crossesMidnight && effectiveEndDate === dateStr && effectiveEndDate !== c.date) {
            entries.push({
                change: c,
                startHour: 0,
                endHour: parseTime(c.endTime),
                isContinuation: true,
                continuesNextDay: false,
            });
        }
    }

    return entries;
}

/** Assign columns to overlapping entries so they render side by side */
function layoutEntries(entries: CalendarEntry[]): LayoutEntry[] {
    if (entries.length === 0) return [];

    // Sort by start hour, then by duration (longer first)
    const sorted = [...entries].sort((a, b) => {
        if (a.startHour !== b.startHour) return a.startHour - b.startHour;
        return (b.endHour - b.startHour) - (a.endHour - a.startHour);
    });

    const columns: { end: number }[] = [];
    const result: LayoutEntry[] = [];

    for (const entry of sorted) {
        // Find first column where entry doesn't overlap
        let col = -1;
        for (let i = 0; i < columns.length; i++) {
            if (entry.startHour >= columns[i].end) {
                col = i;
                break;
            }
        }
        if (col === -1) {
            col = columns.length;
            columns.push({ end: 0 });
        }
        columns[col].end = entry.endHour;
        result.push({ ...entry, column: col, totalColumns: 0 });
    }

    // Now compute overlap groups to set totalColumns correctly
    // Group entries that transitively overlap
    const groups: number[][] = [];
    const visited = new Set<number>();

    for (let i = 0; i < result.length; i++) {
        if (visited.has(i)) continue;
        const group = [i];
        visited.add(i);
        const queue = [i];
        while (queue.length > 0) {
            const curr = queue.shift()!;
            for (let j = 0; j < result.length; j++) {
                if (visited.has(j)) continue;
                const a = result[curr], b = result[j];
                if (a.startHour < b.endHour && b.startHour < a.endHour) {
                    group.push(j);
                    visited.add(j);
                    queue.push(j);
                }
            }
        }
        groups.push(group);
    }

    for (const group of groups) {
        const maxCol = Math.max(...group.map(i => result[i].column)) + 1;
        for (const i of group) {
            result[i].totalColumns = maxCol;
        }
    }

    return result;
}

export function WeeklyCalendar({ changes, onSelectChange, weekStart, onWeekChange }: WeeklyCalendarProps) {
    const monday = getMonday(weekStart);

    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [monday.getTime()]);

    const prevWeek = () => {
        const d = new Date(monday);
        d.setDate(d.getDate() - 7);
        onWeekChange(d);
    };
    const nextWeek = () => {
        const d = new Date(monday);
        d.setDate(d.getDate() + 7);
        onWeekChange(d);
    };
    const goToday = () => onWeekChange(new Date());

    const todayStr = new Date().toISOString().split("T")[0];

    // Pre-compute layout for each day
    const dayLayouts = useMemo(() => {
        return weekDates.map(d => {
            const dateStr = d.toISOString().split("T")[0];
            const entries = getEntriesForDate(changes, dateStr);
            return layoutEntries(entries);
        });
    }, [changes, weekDates]);

    return (
        <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={prevWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[180px] text-center">
            {formatDateShort(weekDates[0])} – {formatDateShort(weekDates[6])}, {weekDates[0].getFullYear()}
          </span>
                    <Button variant="ghost" size="icon" onClick={nextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="secondary" size="sm" onClick={goToday}>Today</Button>
            </div>

            <div className="border border-border rounded-md overflow-auto max-h-[calc(100vh-220px)]">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[900px]">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-secondary/80 backdrop-blur border-b border-border p-2" />
                    {weekDates.map((d, i) => {
                        const dateStr = d.toISOString().split("T")[0];
                        const isToday = dateStr === todayStr;
                        const dayEntryCount = dayLayouts[i].length;
                        return (
                            <div key={i} className={cn(
                                "sticky top-0 z-10 bg-secondary/80 backdrop-blur border-b border-l border-border p-2 text-center",
                                isToday && "bg-primary/10"
                            )}>
                                <div className="text-xs text-muted-foreground">{DAYS[i]}</div>
                                <div className={cn("text-sm font-semibold", isToday && "text-primary")}>{d.getDate()}</div>
                                {dayEntryCount > 0 && (
                                    <div className="text-[10px] text-muted-foreground">{dayEntryCount} change{dayEntryCount > 1 ? "s" : ""}</div>
                                )}
                            </div>
                        );
                    })}

                    {/* Hour rows */}
                    {HOURS.map(hour => (
                        <div key={`row-${hour}`} className="contents">
                            <div className="border-b border-border p-1 text-right pr-2">
                                <span className="text-[10px] font-mono text-muted-foreground">{String(hour).padStart(2, "0")}:00</span>
                            </div>
                            {weekDates.map((d, dayIdx) => {
                                const dateStr = d.toISOString().split("T")[0];
                                const isToday = dateStr === todayStr;
                                // Only render entries that START in this hour cell
                                const hourEntries = dayLayouts[dayIdx].filter(e => Math.floor(e.startHour) === hour);

                                return (
                                    <div key={`${hour}-${dayIdx}`} className={cn(
                                        "border-b border-l border-border relative",
                                        isToday && "bg-primary/[0.03]"
                                    )} style={{ height: `${HOUR_HEIGHT}px` }}>
                                        {hourEntries.map((entry, idx) => {
                                            const duration = entry.endHour - entry.startHour;
                                            const heightPx = Math.max(duration * HOUR_HEIGHT, 26);
                                            const topOffset = (entry.startHour - hour) * HOUR_HEIGHT;
                                            const colors = statusColors[entry.change.status];

                                            // Side-by-side layout
                                            const widthPercent = 100 / entry.totalColumns;
                                            const leftPercent = entry.column * widthPercent;
                                            const isNarrow = entry.totalColumns > 1;

                                            return (
                                                <div
                                                    key={`${entry.change.id}-${entry.isContinuation ? "cont" : "main"}-${idx}`}
                                                    onClick={() => onSelectChange(entry.change)}
                                                    className={cn(
                                                        "absolute rounded border-l-2 cursor-pointer transition-all z-[5] overflow-hidden",
                                                        colors.bg, colors.border, colors.hover,
                                                        "shadow-sm hover:shadow-md hover:z-10",
                                                    )}
                                                    style={{
                                                        top: `${topOffset}px`,
                                                        height: `${heightPx}px`,
                                                        left: `calc(${leftPercent}% + 1px)`,
                                                        width: `calc(${widthPercent}% - 3px)`,
                                                    }}
                                                    title={`${entry.change.code} — ${entry.change.client}\n${entry.change.startTime}–${entry.change.endTime}`}
                                                >
                                                    <div className={cn("px-1.5 py-0.5 h-full flex flex-col", isNarrow && "px-1")}>
                                                        <div className="flex items-center gap-0.5">
                                                            {entry.isContinuation && <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />}
                                                            <span className={cn("font-mono font-semibold truncate", isNarrow ? "text-[9px]" : "text-[10px]")}>
                                {entry.change.code}
                              </span>
                                                            {entry.continuesNextDay && <span className="text-[9px] text-muted-foreground ml-auto shrink-0">→</span>}
                                                        </div>
                                                        {heightPx > 30 && (
                                                            <div className={cn("truncate text-muted-foreground", isNarrow ? "text-[8px]" : "text-[10px]")}>
                                                                {entry.isContinuation ? "(cont.) " : ""}{entry.change.client}
                                                            </div>
                                                        )}
                                                        {heightPx > 50 && !isNarrow && (
                                                            <div className="flex items-center gap-0.5 mt-auto text-[9px] text-muted-foreground">
                                                                <Clock className="h-2.5 w-2.5 shrink-0" />
                                                                <span>{entry.change.startTime}–{entry.change.endTime}</span>
                                                            </div>
                                                        )}
                                                        {heightPx > 50 && isNarrow && (
                                                            <div className="text-[8px] text-muted-foreground mt-auto">
                                                                {entry.change.startTime}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
