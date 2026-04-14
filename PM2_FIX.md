# 🚀 PM2 Fix for Your VPS

## The Problem
PM2 couldn't find the script path because of ES6 module syntax in ecosystem.config.js

## ✅ Quick Fix

### Step 1: Kill any existing processes
```bash
killall -9 node
```

### Step 2: Use the simple PM2 command
```bash
pm2 start server.js --name kargic-admin --env production
```

### Step 3: Make it persistent
```bash
pm2 startup
pm2 save
```

### Step 4: Check status
```bash
pm2 status
pm2 logs kargic-admin
```

## Alternative: Direct Node.js (if PM2 still fails)
```bash
# Simple background process
npm start &
# Or use nohup
nohup npm start &
```

## Verify It's Working
```bash
# Check if app is running
curl http://localhost:3001

# Check CPU usage (should be < 5%)
top
```

## If Still Having Issues

### Option 1: Use systemd instead
```bash
# Copy the service file
sudo cp kargic-admin.service /etc/systemd/system/

# Edit the paths in the service file
sudo nano /etc/systemd/system/kargic-admin.service
# Change /path/to/kargic-admin to your actual path

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable kargic-admin
sudo systemctl start kargic-admin
sudo systemctl status kargic-admin
```

### Option 2: Use screen/tmux
```bash
# Install screen
sudo apt install screen

# Start in screen
screen -S kargic-admin
npm start

# Detach: Ctrl+A, D
# Reattach: screen -r kargic-admin
```

---

**Try the simple PM2 command first - it should work now! 🎉**