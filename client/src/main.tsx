import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/theme-provider";
import { initCacheBusting } from "./lib/cache-buster";

// Theme will be handled by ThemeProvider

// Initialize cache busting mechanisms
initCacheBusting();

// Disable browser caching for development
if (import.meta.env.DEV) {
  // Override fetch to add cache-busting headers for development
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    if (typeof args[0] === 'string' && args[0].includes('/api/')) {
      // This is an API request, add no-cache headers
      const options = args[1] || {};
      options.headers = {
        ...options.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      options.cache = 'no-store';
      
      // Add timestamp parameter to URL
      const url = new URL(args[0], window.location.origin);
      url.searchParams.set('_t', Date.now().toString());
      args[0] = url.toString();
      args[1] = options;
    }
    return originalFetch.apply(window, args);
  };
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
