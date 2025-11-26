import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "dark" | "midnight" | "ocean" | "forest" | "sunset" | "rose" | "slate" | "navy" | "sapphire" | "teal" | "plum" | "violet" | "emerald" | "jade" | "charcoal" | "obsidian" | "lavender" | "amethyst" | "cobalt";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return (stored as Theme) || "default";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("default", "dark", "midnight", "ocean", "forest", "sunset", "rose", "slate", "navy", "sapphire", "teal", "plum", "violet", "emerald", "jade", "charcoal", "obsidian", "lavender", "amethyst", "cobalt");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "default" ? "dark" : "default"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
