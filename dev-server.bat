@echo off
echo Starting Rocky Mountain Weddings Development Server
echo This will provide a local server with live media updates and logging

:: Make sure Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js to use this development server.
    pause
    exit /b 1
)

:: Check if required npm packages are installed, install if not
call npm list express >nul 2>nul || (
    echo Installing required npm packages...
    call npm install express body-parser
)

:: Start the media file watcher in a separate window
start cmd /c "title Media Watcher && watch-media.bat"

:: Start the development server
echo Starting development server...
node src/assets/log-api.js

pause 