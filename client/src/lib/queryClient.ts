import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper to add cache-busting timestamp to URLs
const addCacheBustingParams = (url: string): string => {
  // Don't add cache-busting for non-API URLs
  if (!url.startsWith('/api')) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Add cache-busting timestamp to prevent browser caching
  const cacheBustedUrl = addCacheBustingParams(url);
  
  const res = await fetch(cacheBustedUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      // Prevent caching with headers
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Tell browser to bypass cache
    cache: "no-store"
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Add cache-busting timestamp to prevent browser caching
    const url = queryKey[0] as string;
    const cacheBustedUrl = addCacheBustingParams(url);
    
    const res = await fetch(cacheBustedUrl, {
      credentials: "include",
      headers: {
        // Prevent caching with headers
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      // Tell browser to bypass cache
      cache: "no-store"
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      // Change to true - Automatically refetch when window regains focus
      refetchOnWindowFocus: true,
      // Change to 0 - Data is always considered stale
      staleTime: 0,
      // Disable caching behavior (use gcTime in v5 instead of cacheTime)
      gcTime: 0,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
