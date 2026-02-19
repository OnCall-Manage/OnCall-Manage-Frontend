import type {ReactNode} from "react";
import { Database, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle.tsx";
import { Button } from "@/components/ui/button";

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
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

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
                        {user && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-foreground/70">
                                    {user.username} <span className="text-xs text-foreground/50">({user.role})</span>
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="h-8 w-8 p-0"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
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
