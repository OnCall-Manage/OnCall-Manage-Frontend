import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const THEME_KEY = "dba-oncall-theme";

function getStoredTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(getStoredTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
    }, []);

    return { theme, toggleTheme, setTheme };
}
