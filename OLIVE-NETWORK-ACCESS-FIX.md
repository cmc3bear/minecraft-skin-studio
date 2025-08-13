# 🔧 Fix Network Access for Olive

## Quick Fix (Run as Administrator)

1. **Right-click** on `ENABLE-NETWORK-ACCESS.bat`
2. Select **"Run as administrator"**
3. Click **"Yes"** when Windows asks for permission
4. This will configure the firewall to allow access

## Manual Steps if Needed

### Option 1: Windows Defender Firewall
1. Open Windows Settings
2. Go to "Update & Security" → "Windows Security" → "Firewall & network protection"
3. Click "Allow an app through firewall"
4. Click "Change settings" (need admin)
5. Click "Allow another app..."
6. Browse to: `C:\Program Files\nodejs\node.exe`
7. Check both "Private" and "Public" boxes
8. Click OK

### Option 2: Try Different Browser
Sometimes browsers have security settings that block local network access:
- Try Microsoft Edge instead of Chrome
- Try Firefox
- Disable any VPN if running

### Option 3: Direct Connection Test
1. On Olive's computer, open Command Prompt
2. Type: `ping 192.168.2.4`
3. If it says "Request timed out" - there's a network issue
4. If it shows replies - the network is OK, it's just a firewall issue

## Current Access URLs

After running the firewall fix, Olive should be able to access:

- **Development Server**: `http://192.168.2.4:5173`
- **Alternative URL**: `http://192.168.2.4:5173/`

## Alternative Solution: Use Same Computer

If network access still doesn't work, Olive can:
1. Use the same computer the server is running on
2. Open browser and go to: `http://localhost:5173`

## Testing Connection

From Olive's computer, she can test if the connection works:
1. Open browser
2. Try going to: `http://192.168.2.4:5173`
3. If it doesn't work, check:
   - Is she on the same Wi-Fi network?
   - Did you run the firewall fix as admin?
   - Try turning off Windows Defender Firewall temporarily (Settings → Update & Security → Windows Security → Firewall & network protection → Turn off)

## 🚨 Important Note

The server must be running! Check if you see this in the command window:
```
VITE v7.1.1 ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.2.4:5173/
```

If not, run: `cd minecraft-skin-studio && npm run dev`