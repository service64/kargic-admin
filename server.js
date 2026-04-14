import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Enable gzip compression
app.use(compression());

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d', // Cache for 1 day
  etag: false
}));

// SPA fallback - serve index.html for all unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Serving from: ${path.join(__dirname, 'dist')}`);
});
