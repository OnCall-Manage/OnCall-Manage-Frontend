import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (!user) return null;

    const displayName = user.nombre && user.apellido
        ? `${user.nombre} ${user.apellido}`
        : (user.nombre || user.username || "Usuario");

    const position = user.puesto && user.puesto.trim()
        ? user.puesto
        : (user.role || "N/A");


    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleManageUsers = () => {
        navigate("/users");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-accent/50"
                >
                    <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                            {displayName}
                        </div>
                        <div className="text-xs text-foreground/50">
                            {position}
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    {user.email && <p className="text-xs text-foreground/60">{user.email}</p>}
                </div>
                <DropdownMenuSeparator />
                {user.role === "ADMIN" && (
                    <>
                        <DropdownMenuItem onClick={handleManageUsers}>
                            <Users className="h-4 w-4 mr-2" />
                            <span>Gestionar Usuarios</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


