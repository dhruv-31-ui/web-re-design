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

// Serve only the dist/ and public/ directories — NOT the project root
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// Clean URL routing - serve .html files without extension
const distDir = path.resolve(__dirname, '..', 'dist');

app.use((req, res, next) => {
  // Skip API routes and requests with file extensions
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }

  const filePath = path.resolve(distDir, req.path.slice(1) + '.html');

  // Prevent directory traversal — ensure resolved path stays inside dist/
  if (!filePath.startsWith(distDir + path.sep) && filePath !== distDir) {
    return res.status(400).send('Bad request');
  }

  // Try to serve the .html file from dist
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // Fallback for client-side routes
  return res.sendFile(path.resolve(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
