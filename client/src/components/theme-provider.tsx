"use client";

import * as React from "react";
import { createContext, useContext, useEffect } from "react";

// Keep the types for backward compatibility
type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme; // Kept for backward compatibility
  storageKey?: string;  // Kept for backward compatibility
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "dark",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Get theme from local storage or use default
  const [theme, setTheme] = React.useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (error) {
      return defaultTheme;
    }
  });

  // Apply theme class to root element when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove any existing theme classes
    root.classList.remove("light", "dark", "system");
    // Add new theme class
    root.classList.add(theme);
    // Save to local storage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Failed to save theme to local storage", error);
    }
  }, [theme, storageKey]);

  // Create memoized context value
  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        setTheme(newTheme);
      },
    }),
    [theme]
  );

  return (
    <ThemeProviderContext.Provider 
      value={value}
      {...props}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}
