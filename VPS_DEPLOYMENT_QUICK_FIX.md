# 🚀 Quick Fix for CPU 100% Issue on Hostinger VPS

## What's Causing the CPU Spike

You're probably running `npm run dev` in production, which:
- Continuously recompiles your code
- Watches all files for changes
- Is designed for local development, NOT production
- Uses 80-90% CPU even at idle

## ✅ Step-by-Step Fix (5 minutes)

### Step 1: SSH into Your VPS
```bash
ssh your-vps-ip
cd /path/to/kargic-admin
```

### Step 2: Kill the Current Process
```bash
# Find the process
ps aux | grep node
ps aux | grep vite

# Kill it (replace XXXX with the PID)
kill -9 XXXX

# Or kill all node processes
killall node
```

### Step 3: Install Dependencies
```bash
pnpm install
# or if using npm
npm install
```

### Step 4: Build for Production
```bash
npm run build
# This creates the `dist/` folder with optimized static files
```

### Step 5: Start the Production Server

**Option A: Simple (One Process)**
```bash
npm start
# Server runs on port 3001
```

**Option B: Better (Persistent + Monitoring)**
```bash
npm install -g pm2

# Start with PM2
npm run start:pm2

# Make it autostart on reboot
pm2 startup
pm2 save

# Monitor
pm2 logs kargic-admin
pm2 status
```

**Option C: Best (Nginx Reverse Proxy)**
```bash
# Install Nginx on Hostinger
sudo apt update
sudo apt install nginx

# Copy our config
sudo cp nginx.conf /etc/nginx/sites-available/kargic-admin-vps
sudo ln -s /etc/nginx/sites-available/kargic-admin-vps /etc/nginx/sites-enabled/

# Edit the config with your domain
sudo nano /etc/nginx/sites-available/kargic-admin-vps
# Change: your-domain.com to your actual domain
# Change: /path/to/kargic-admin/dist to your actual path

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Verify It's Working
```bash
# Check if process is running
curl http://localhost:3001
# Should return HTML

# Check CPU usage (should be < 5%)
top
```

## 📊 Expected Performance

| Before | After |
|--------|-------|
| CPU: 80-100% | CPU: 1-5% |
| Memory: High | Memory: ~100MB |
| Build: Every change | Build: Once at startup |

## 🔍 Troubleshooting

### Still high CPU?
```bash
# Kill all node processes
killall -9 node

# Start fresh
npm run build
npm start
```

### Port already in use?
```bash
# Find what's using port 3001
lsof -i :3001

# Kill it
kill -9 XXXX

# Or use different port
PORT=3002 npm start
```

### Need to restart?
```bash
# If using PM2
pm2 restart kargic-admin

# Check logs
pm2 logs kargic-admin
```

## 📝 Important Files Created

1. **server.js** - Express server to serve your app
2. **ecosystem.config.js** - PM2 configuration
3. **nginx.conf** - Nginx reverse proxy config
4. **DEPLOYMENT.md** - Full deployment guide

## 🔐 Security Tips

- [ ] Enable HTTPS with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

- [ ] Set proper file permissions:
```bash
chmod 755 /path/to/kargic-admin
chmod 755 /path/to/kargic-admin/dist
```

- [ ] Monitor CPU/Memory:
```bash
# Install monitoring tools
npm install -g top
# or use htop
sudo apt install htop
htop
```

## 📞 Need Help?

- Check CPU: `top` or `htop`
- Check logs: `npm run logs` or `pm2 logs kargic-admin`
- Check port: `lsof -i :3001` or `netstat -tuln | grep 3001`
- Check disk: `df -h`

---

**After implementing these steps, your CPU usage should drop from 100% to ~5% or less! 🎉**
