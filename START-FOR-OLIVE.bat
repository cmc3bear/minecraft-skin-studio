@echo off
color 0A
cls
echo ============================================
echo     MINECRAFT SKIN STUDIO - FOR OLIVE
echo ============================================
echo.
echo Hi Olive! Starting your Minecraft Skin Studio...
echo.
echo The app will open in your browser in a moment!
echo.
timeout /t 2 /nobreak > nul

:: Open the app in default browser
start http://localhost:5173

echo.
echo ============================================
echo           APP IS NOW RUNNING!
echo ============================================
echo.
echo The Minecraft Skin Studio should now be open
echo in your web browser!
echo.
echo If it didn't open automatically, go to:
echo http://localhost:5173
echo.
echo ============================================
echo    IMPORTANT: Keep this window open!
echo    Close it when you're done playing.
echo ============================================
echo.
echo Have fun creating skins!
echo.
pause