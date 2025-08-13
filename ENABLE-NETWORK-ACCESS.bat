@echo off
echo ==========================================
echo  Minecraft Skin Studio - Network Setup
echo ==========================================
echo.
echo This will configure Windows Firewall to allow
echo Olive (and others on your network) to access
echo the Minecraft Skin Studio.
echo.
echo You will need to approve the Administrator prompt.
echo.
pause

:: Run PowerShell script as Administrator
powershell -Command "Start-Process PowerShell -ArgumentList '-ExecutionPolicy Bypass -File ""%~dp0enable-network-access.ps1""' -Verb RunAs"