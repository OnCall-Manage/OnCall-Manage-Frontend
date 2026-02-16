import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-8 w-8"
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
                <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            )}
        </Button>
    );
}
