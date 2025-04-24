"use client";

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

// Create a fixed context that always returns dark mode
const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "dark",
  setTheme: () => null,
});

// ThemeProvider component that enforces dark mode
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Apply dark mode class to root element on mount
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove any existing theme classes
    root.classList.remove("light", "system");
    // Always add dark class
    root.classList.add("dark");
  }, []); // Only run once on mount

  return (
    <ThemeProviderContext.Provider 
      value={{
        theme: "dark",
        setTheme: () => {
          // No-op function - dark mode is always enforced
        },
      }}
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
