"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const t = useTranslations("themeToggle");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("stellar_theme") as "dark" | "light" | null;
      if (stored === "light") {
        setThemeState("light");
        document.documentElement.classList.add("light");
      } else {
        setThemeState("dark");
        document.documentElement.classList.remove("light");
      }
    } catch (e) {}
  }, []);

  const setTheme = (nextTheme: "dark" | "light") => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem("stellar_theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch (e) {}
  };

  if (!mounted) {
    return (
      <div className={`h-8 w-16 border border-[#333333] bg-[#111111] opacity-60 box-border rounded-[2px] ${className}`} />
    );
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`h-8 inline-flex items-center border border-[#333333] bg-[#111111] box-border rounded-[2px] ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label={t("switchToNight")}
        title={t("switchToNight")}
        className={`h-full px-2.5 flex items-center justify-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
          theme === "dark"
            ? "bg-[#76b900] text-black"
            : "text-[#a7a7a7] hover:text-white hover:bg-[#1f1f1f]"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">{t("night")}</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label={t("switchToDay")}
        title={t("switchToDay")}
        className={`h-full px-2.5 flex items-center justify-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
          theme === "light"
            ? "bg-[#76b900] text-black"
            : "text-[#a7a7a7] hover:text-white hover:bg-[#1f1f1f]"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">{t("day")}</span>
      </button>
    </div>
  );
}
