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

### 5. Option D: Use Caddy (Hardened Reverse Proxy)
Use the `Caddyfile` in this repository.

```bash
# Build and run the app server first
npm run build
PORT=3001 node server.js

# In another shell: install and configure caddy
sudo apt update
sudo apt install -y caddy

# Copy hardened config
sudo cp Caddyfile /etc/caddy/Caddyfile

# Set your real values
sudo DOMAIN=admin.kargic.com APP_PORT=3001 ACME_EMAIL=you@example.com caddy validate --config /etc/caddy/Caddyfile

# Reload caddy with env vars
sudo systemctl edit caddy
```

Create this drop-in content:

```ini
[Service]
Environment="DOMAIN=admin.kargic.com"
Environment="APP_PORT=3001"
Environment="ACME_EMAIL=you@example.com"
```

Then apply and verify:

```bash
sudo systemctl daemon-reload
sudo systemctl restart caddy
sudo systemctl status caddy
sudo journalctl -u caddy -n 100 --no-pager
```

Security notes for this Caddy setup:
- Blocks common secret/probe paths like `/.git` and `/.env`
- Blocks known crawler/scanner user agents (including `OAI-SearchBot`)
- Serves strict `robots.txt` policy from the edge
- Adds baseline security headers before proxying

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
