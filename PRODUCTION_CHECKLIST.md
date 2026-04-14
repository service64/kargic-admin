# 📋 Complete Production Deployment Checklist

## Phase 1: Local Verification (Before Deploying to VPS)

- [ ] Run `npm run build` locally and verify no errors
- [ ] Check `dist/` folder exists with files
- [ ] Verify TypeScript compilation: `tsc -b`
- [ ] Run linter: `npm run lint`
- [ ] Test the production build: `npm run preview`

## Phase 2: VPS Preparation

### Environment Setup
- [ ] SSH access to VPS working
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm/pnpm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Clone repository: `git clone https://github.com/service64/kargic-admin.git`

### Directory Setup
- [ ] Project directory created: `/path/to/kargic-admin`
- [ ] Permissions set correctly: `chmod 755` on project folder
- [ ] Old processes killed: `killall node` or `killall vite`

## Phase 3: Application Deployment

### Build
- [ ] Install dependencies: `pnpm install` or `npm install`
- [ ] Run compile check: `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Check file sizes are reasonable (not >1MB per JS file)

### Choose Your Deployment Method

#### Option A: Direct Node.js (Simple)
- [ ] Start server: `npm start`
- [ ] Verify running: `curl http://localhost:3001`
- [ ] Note: Process stops if terminal closes

#### Option B: PM2 (Recommended for Simple VPS)
- [ ] Install PM2: `npm install -g pm2`
- [ ] Install dependencies: `npm install` (for express, compression)
- [ ] Start app: `npm run start:pm2`
- [ ] Make persistent: `pm2 startup && pm2 save`
- [ ] Monitor: `pm2 status` and `pm2 logs`

#### Option C: Systemd Service (Alternative to PM2)
- [ ] Copy service file: `sudo cp kargic-admin.service /etc/systemd/system/`
- [ ] Edit paths: `sudo nano /etc/systemd/system/kargic-admin.service`
- [ ] Reload systemd: `sudo systemctl daemon-reload`
- [ ] Enable auto-start: `sudo systemctl enable kargic-admin`
- [ ] Start service: `sudo systemctl start kargic-admin`
- [ ] Verify: `sudo systemctl status kargic-admin`

#### Option D: Nginx Reverse Proxy (Best for Production)
- [ ] Install Nginx: `sudo apt install nginx`
- [ ] Copy config: `sudo cp nginx.conf /etc/nginx/sites-available/kargic-admin`
- [ ] Enable site: `sudo ln -s /etc/nginx/sites-available/kargic-admin /etc/nginx/sites-enabled/`
- [ ] Edit config: `sudo nano /etc/nginx/sites-available/kargic-admin`
  - [ ] Replace `your-domain.com` with actual domain
  - [ ] Replace `/path/to/kargic-admin` with actual path
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

## Phase 4: Testing & Verification

### Basic Functionality
- [ ] App accessible on VPS IP: `http://vps-ip:3001`
- [ ] App accessible on domain: `http://your-domain.com` (if DNS configured)
- [ ] Login page loads without errors
- [ ] Dashboard displays correctly
- [ ] Charts render without issues
- [ ] Tables load and display data
- [ ] Sidebar navigation works
- [ ] No console errors in browser

### Performance Metrics
- [ ] CPU usage < 10% at idle (`top` or `htop`)
- [ ] Memory usage < 200MB (`free -h`)
- [ ] Page load time acceptable (< 2 seconds)
- [ ] Check with `curl -w "@curl-format.txt" http://localhost:3001`

### Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari/Mobile
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] All buttons and links clickable
- [ ] Forms can be submitted

## Phase 5: Security & Optimization

### HTTPS/SSL
- [ ] Install Let's Encrypt: `sudo apt install certbot python3-certbot-nginx`
- [ ] Create certificate: `sudo certbot certonly --nginx -d your-domain.com`
- [ ] Update Nginx config with SSL paths
- [ ] Test HTTPS: `https://your-domain.com`
- [ ] Set auto-renewal: `sudo certbot renew --dry-run`

### Security Headers (Add to Nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Optimization
- [ ] Enable gzip compression (configured in server.js)
- [ ] Set cache headers (1 day for static assets)
- [ ] Minify assets (done in build)
- [ ] Enable etag (configured)

## Phase 6: Monitoring & Maintenance

### Logging
- [ ] Review error logs: `pm2 logs` or `journalctl -u kargic-admin`
- [ ] Set up log rotation (if needed)
- [ ] Monitor for errors in real-time

### Monitoring Tools
- [ ] Install monitoring: `sudo apt install htop`
- [ ] Check CPU/Memory regularly: `htop`
- [ ] Set up alerts (optional): Consider Uptime Robot for status checks

### Backups
- [ ] Backup .env file regularly
- [ ] Version control important configs
- [ ] Document custom configurations

### Regular Maintenance
- [ ] Update dependencies monthly: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Monitor disk space: `df -h`
- [ ] Review logs for errors

## Phase 7: Troubleshooting

### High CPU Usage Still?
```bash
# Kill everything
killall -9 node
killall -9 vite

# Rebuild fresh
npm run build

# Start with monitoring
top &
npm start
```

### Port Already in Use?
```bash
lsof -i :3001
# Kill process using port
kill -9 <PID>

# Or use different port
PORT=3002 npm start
```

### App Not Loading?
```bash
# Check if process running
ps aux | grep node

# Check logs
pm2 logs
journalctl -u kargic-admin -n 50

# Check browser console for errors
# Open DevTools (F12)
```

### Out of Memory?
```bash
# Check memory usage
free -h

# Increase swap (temporary)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Or upgrade VPS plan
```

## Phase 8: Optional Enhancements

- [ ] Add health check endpoint in server.js
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add analytics (Google Analytics, Hotjar)
- [ ] Set up error tracking (Sentry)
- [ ] Enable CDN for static assets (Cloudflare)
- [ ] Add rate limiting to server.js
- [ ] Implement database connection pooling (when needed)

## 🎯 Success Criteria

✅ App is running at `http://your-domain.com`
✅ CPU usage is < 10% at idle
✅ Memory usage is < 250MB
✅ Page loads in < 2 seconds
✅ HTTPS/SSL is working
✅ Process restarts automatically if it crashes
✅ All pages render correctly
✅ No console errors in browser

---

## 📞 Quick Command Reference

```bash
# Build
npm run build

# Start development
npm run dev

# Start production
npm start

# With PM2
pm2 start server.js --name "kargic-admin"
pm2 status
pm2 logs kargic-admin
pm2 restart kargic-admin
pm2 stop kargic-admin

# With systemd
sudo systemctl start kargic-admin
sudo systemctl status kargic-admin
sudo systemctl restart kargic-admin
sudo systemctl stop kargic-admin

# Monitor
top  # or htop
ps aux | grep node
lsof -i :3001

# Logs
pm2 logs
journalctl -u kargic-admin -n 50
tail -f /var/log/nginx/access.log
```

---

**Last Updated:** 2025-04-14
**Version:** 1.0
