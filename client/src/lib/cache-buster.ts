/**
 * Utility functions to help prevent excessive caching
 */

/**
 * Add a timestamp parameter to a URL to prevent caching
 */
export function addCacheBustParam(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
}

/**
 * Clear all browser caches
 */
export async function clearBrowserCaches(): Promise<void> {
  // Clear caches using the Cache API if available
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
  }
}

/**
 * Force reload the page
 */
export function forceReload(): void {
  console.log('Forcing page reload to clear cache');
  window.location.reload();
}

/**
 * Initialize cache busting mechanisms
 */
export function initCacheBusting(): void {
  // Add timestamp to localStorage to detect new app versions
  const timestamp = Date.now().toString();
  const lastTimestamp = localStorage.getItem('app_timestamp');
  
  // Store current timestamp
  localStorage.setItem('app_timestamp', timestamp);
  
  // If timestamps differ significantly (more than 2 minutes), reload
  if (lastTimestamp && Math.abs(parseInt(lastTimestamp) - parseInt(timestamp)) > 120000) {
    console.log('App version changed, reloading...');
    window.location.reload();
  }
  
  // Add event listener to detect when the user returns to the app
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // User has returned to the app
      const currentTimestamp = localStorage.getItem('app_timestamp');
      if (currentTimestamp !== timestamp) {
        console.log('App version changed while in background, reloading...');
        window.location.reload();
      }
    }
  });
}