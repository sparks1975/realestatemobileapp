// Vite plugin to disable caching
import { Plugin } from 'vite';

export default function noCachePlugin(): Plugin {
  return {
    name: 'no-cache-plugin',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          // Set cache-control headers for all responses
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('Surrogate-Control', 'no-store');
          next();
        });
      };
    },
    transformIndexHtml(html) {
      // Add timestamp comment to force browser to reload the HTML
      const timestamp = new Date().toISOString();
      return html.replace(
        '</head>',
        `<!-- Timestamp: ${timestamp} -->
<script>
// Check if this is an old version
window.__TIMESTAMP__ = "${timestamp}";
if (localStorage.getItem('app_timestamp') && 
    localStorage.getItem('app_timestamp') !== window.__TIMESTAMP__) {
  // This is an old version, force reload
  console.log('New version detected, reloading...');
  localStorage.setItem('app_timestamp', window.__TIMESTAMP__);
  window.location.reload(true);
} else {
  localStorage.setItem('app_timestamp', window.__TIMESTAMP__);
}
</script>
</head>`
      );
    }
  };
}