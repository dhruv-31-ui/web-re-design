import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security Headers ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
      connectSrc: ["'self'", "https://api.web3forms.com"],
      frameAncestors: ["'none'"],
    }
  },
  crossOriginEmbedderPolicy: false, // allow cross-origin images
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

app.use(express.json());

// Serve only the dist/ and public/ directories — NOT the project root.
const distDir = path.resolve(__dirname, '..', 'dist');
const publicDir = path.resolve(__dirname, '..', 'public');

app.use((req, res, next) => {
  // Match the site's extensionless canonical URLs and avoid serving directory
  // index files ahead of a same-named top-level HTML page (for example,
  // /services.html and /services/index.html).
  if (req.path.length > 1 && req.path.endsWith('/') && !req.path.includes('.')) {
    const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    return res.redirect(308, `${req.path.slice(0, -1)}${query}`);
  }

  if (req.path === '/') {
    return res.sendFile(path.join(distDir, 'index.html'));
  }

  // Skip API routes and requests with file extensions; static middleware
  // below will serve those files.
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }

  const filePath = path.resolve(distDir, req.path.slice(1) + '.html');

  // Prevent directory traversal — ensure resolved path stays inside dist/
  if (!filePath.startsWith(distDir + path.sep) && filePath !== distDir) {
    return res.status(400).send('Bad request');
  }

  // Try the matching multi-page HTML entry before static directory indexes.
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  return next();
});

app.use(express.static(distDir, { index: false }));
app.use(express.static(publicDir, { index: false }));

// This is a multi-page site. Missing routes must remain real 404s instead of
// returning the homepage with a successful status.
app.use((req, res) => res.status(404).send('Not Found'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
