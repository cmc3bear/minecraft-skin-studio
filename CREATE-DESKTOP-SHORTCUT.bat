@echo off
echo Creating Desktop Shortcut for Minecraft Skin Studio...

:: Create a VBS script to create the shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = oWS.ExpandEnvironmentStrings("%%USERPROFILE%%\Desktop\Minecraft Skin Studio.lnk") >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "http://localhost:5173" >> CreateShortcut.vbs
echo oLink.Description = "Minecraft Skin Studio for Olive" >> CreateShortcut.vbs
echo oLink.IconLocation = "%%ProgramFiles(x86)%%\Microsoft\Edge\Application\msedge.exe, 0" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

:: Run the VBS script
cscript CreateShortcut.vbs
del CreateShortcut.vbs

echo.
echo ✅ Desktop shortcut created!
echo.
echo Olive can now click "Minecraft Skin Studio" on the desktop to open the app!
echo.
pause