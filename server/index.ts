import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Custom JSON parser for specific endpoints that need special handling
app.use(['/api/theme-settings', '/api/pages/content'], (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    let rawData = '';
    req.on('data', chunk => {
      rawData += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('🔧 Custom parser - Raw data:', rawData);
      console.log('🔧 Custom parser - Data length:', rawData.length);
      console.log('🔧 Custom parser - URL:', req.url);
      
      if (rawData && rawData.trim().startsWith('{')) {
        try {
          req.body = JSON.parse(rawData);
          console.log('🔧 Custom parser - Parsed body:', req.body);
        } catch (error) {
          console.log('🔧 Custom parser - JSON parse error:', error);
          req.body = {};
        }
      } else {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

// Keep the original parsers as fallback
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Debug middleware to log request body parsing
app.use((req, res, next) => {
  if ((req.method === 'PUT' || req.method === 'POST') && (req.url.includes('/api/properties') || req.url.includes('/api/theme-settings'))) {
    console.log('🔧 Middleware - Method:', req.method, 'URL:', req.url);
    console.log('🔧 Middleware - Content-Type:', req.headers['content-type']);
    console.log('🔧 Middleware - Content-Length:', req.headers['content-length']);
    console.log('🔧 Middleware - Raw body:', req.body);
    console.log('🔧 Middleware - Body type:', typeof req.body);
    console.log('🔧 Middleware - Body keys:', Object.keys(req.body || {}));
    console.log('🔧 Middleware - Raw request data available:', !!req.readable);
  }
  next();
});

// Add cache-busting headers for all API requests and responses
app.use((req, res, next) => {
  // Add cache control headers to prevent caching for API routes
  if (req.path.startsWith('/api')) {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
  }
  
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    // Add a timestamp to JSON responses to prevent browser caching
    if (typeof bodyJson === 'object' && bodyJson !== null) {
      bodyJson._timestamp = Date.now();
    }
    
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
