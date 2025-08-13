# PowerShell script to enable network access for Minecraft Skin Studio
# Run this script as Administrator

Write-Host "Minecraft Skin Studio - Network Access Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Add firewall rules for development server
Write-Host "Adding Windows Firewall rules..." -ForegroundColor Yellow

# Rule for port 5173 (development server)
New-NetFirewallRule -DisplayName "Minecraft Skin Studio Dev (Port 5173)" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 5173 `
    -Action Allow `
    -Profile Any `
    -ErrorAction SilentlyContinue

# Rule for port 3000 (production server)
New-NetFirewallRule -DisplayName "Minecraft Skin Studio Prod (Port 3000)" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3000 `
    -Action Allow `
    -Profile Any `
    -ErrorAction SilentlyContinue

# Rule for Node.js
New-NetFirewallRule -DisplayName "Node.js for Minecraft Skin Studio" `
    -Direction Inbound `
    -Program "C:\Program Files\nodejs\node.exe" `
    -Action Allow `
    -Profile Any `
    -ErrorAction SilentlyContinue

Write-Host "Firewall rules added successfully!" -ForegroundColor Green
Write-Host ""

# Display network information
Write-Host "Your network addresses:" -ForegroundColor Cyan
$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" }
foreach ($ip in $ips) {
    Write-Host "  - http://$($ip.IPAddress):5173" -ForegroundColor White
}

Write-Host ""
Write-Host "Olive can now access the app from her computer using any of the addresses above!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")