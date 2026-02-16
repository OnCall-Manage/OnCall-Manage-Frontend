import type {ReactNode} from "react";
import { Database } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle.tsx";

interface AppLayoutProps {
    children: ReactNode;
    headerActions?: ReactNode;
    stats?: ReactNode;
}

/**
 * Main application shell.
 * Designed to support future authentication (login gate, user menu, etc.)
 */
export function AppLayout({ children, headerActions, stats }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-20">
                <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-primary" />
                        <h1 className="font-semibold text-foreground">DBA On-Call Manager</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {stats}
                        <ThemeToggle />
                        {/* Future: User avatar / auth menu goes here */}
                        {headerActions}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 py-4">
                {children}
            </main>
        </div>
    );
}
