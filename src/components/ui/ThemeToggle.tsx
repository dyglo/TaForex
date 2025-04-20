"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Button from "./Button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const osPref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(osPref);
      document.documentElement.classList.toggle("dark", osPref === "dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <Button onClick={toggle} variant="outline" size="sm" className="ml-auto">
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
