"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, AArrowUp, AArrowDown } from "lucide-react";

export function ThemeControls() {
  const [dark, setDark] = useState(true);
  const [large, setLarge] = useState(false);

  // Read preferences on mount
  useEffect(() => {
    const theme = localStorage.getItem("egpt-theme") ?? "dark";
    const size = localStorage.getItem("egpt-fontsize") ?? "normal";
    setDark(theme === "dark");
    setLarge(size === "large");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("egpt-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  function toggleFontSize() {
    const next = !large;
    setLarge(next);
    localStorage.setItem("egpt-fontsize", next ? "large" : "normal");
    document.documentElement.classList.toggle("font-large", next);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggleFontSize}
        title={large ? "Normal text size" : "Larger text for accessibility"}
        className="flex items-center justify-center h-7 w-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
      >
        {large ? <AArrowDown className="h-3.5 w-3.5" /> : <AArrowUp className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={toggleTheme}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex items-center justify-center h-7 w-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
      >
        {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
