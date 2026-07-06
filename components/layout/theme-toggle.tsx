"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative size-9 min-h-9 min-w-9"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="size-4 opacity-0" aria-hidden />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative size-9 min-h-9 min-w-9"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        aria-hidden
      />
      <Moon
        className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        aria-hidden
      />
    </Button>
  );
}
