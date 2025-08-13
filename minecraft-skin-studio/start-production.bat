@echo off
echo Starting Minecraft Skin Studio - Production Server
echo.
echo This will start a local web server for the production build
echo Access the app at: http://localhost:3000
echo Or on network at: http://192.168.2.4:3000
echo.
echo Press Ctrl+C to stop the server
echo.
npx serve -s dist -p 3000 -l 3000