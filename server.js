import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const BLOCKED_PATH_PATTERNS = [
  /^\/\.git(?:\/|$)/i,
  /^\/\.svn(?:\/|$)/i,
  /^\/\.hg(?:\/|$)/i,
  /^\/\.env(?:$|\.)/i,
  /^\/\.ht/i,
  /^\/wp-admin(?:\/|$)/i,
  /^\/wp-login\.php$/i,
  /^\/phpmyadmin(?:\/|$)/i,
  /^\/cgi-bin(?:\/|$)/i,
  /^\/actuator(?:\/|$)/i,
  /^\/server-status$/i,
];

// Enable gzip compression
app.use(compression());

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Drop common scanner targets before static serving or SPA fallback.
app.use((req, res, next) => {
  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(req.path))) {
    return res.status(404).type('text/plain').send('Not found');
  }

  return next();
});

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d', // Cache for 1 day
  etag: false,
  dotfiles: 'ignore',
}));

// SPA fallback only for browser document requests, not probe/file paths.
app.get('*', (req, res) => {
  const acceptHeader = req.headers.accept || '';
  const acceptsHtml = acceptHeader.includes('text/html');
  const hasFileExtension = path.extname(req.path) !== '';

  if (!acceptsHtml || hasFileExtension) {
    return res.status(404).type('text/plain').send('Not found');
  }

  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Serving from: ${path.join(__dirname, 'dist')}`);
});
