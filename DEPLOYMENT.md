# Production Deployment Guide

## Quick Start (CPU Issue Fix)

### 1. Build for Production
```bash
npm run build
# This creates an optimized `dist/` folder with minified assets
```

### 2. Option A: Serve with Node.js + Express (Recommended)
```bash
npm install express compression
```

Then use the server file: `server.js` (included)

```bash
node server.js
# App runs on http://localhost:3001
```

### 3. Option B: Serve with PM2 (Keep Running)
```bash
npm install -g pm2
pm2 start server.js --name "kargic-admin" --instances 1 --max-memory-restart 500M
pm2 startup
pm2 save
```

Check status:
```bash
pm2 status
pm2 logs kargic-admin
```

### 4. Option C: Use Nginx (Reverse Proxy)
Use the `nginx.conf` file in this repository.

```bash
sudo cp nginx.conf /etc/nginx/sites-available/kargic-admin
sudo ln -s /etc/nginx/sites-available/kargic-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Why CPU Was at 100%

- ❌ Running `npm run dev` or `npm run dev` in production (Vite dev server)
- ✅ Solution: Build once with `npm run build`, then serve the static files

## Environment Variables

Create a `.env.production` file if needed:
```
VITE_API_URL=https://your-api.com
```

Then rebuild: `npm run build`

## Production Checklist

- [ ] Run `npm run build` before deploying
- [ ] Use `server.js` or Nginx to serve
- [ ] Enable gzip compression
- [ ] Set proper cache headers
- [ ] Monitor with PM2
- [ ] Set up SSL/HTTPS
- [ ] Monitor CPU and memory usage
