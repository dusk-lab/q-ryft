import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
    // Default to light as requested
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        const saved = localStorage.getItem("qryft-theme");
        if (saved === "dark" || saved === "light") return saved;

        // Default to light
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("qryft-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    return { theme, toggleTheme };
}
