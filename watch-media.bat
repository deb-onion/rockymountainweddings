@echo off
echo Starting media file watcher for Rocky Mountain Weddings
echo This will monitor changes to media files and trigger live reload
echo Updates will be logged in src/assets/media-updates.log

:: Make sure Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js to use this watcher.
    pause
    exit /b 1
)

:: Check if chokidar is installed, install if not
call npm list -g chokidar-cli >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing chokidar-cli...
    call npm install -g chokidar-cli
)

:: Start the watcher
echo Watching for changes in src/assets/images and src/assets/videos...
chokidar "src/assets/images/**/*" "src/assets/videos/**/*" -c "node src/assets/update-media-timestamp.js {path}"

pause 