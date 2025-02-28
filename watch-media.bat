@echo off
echo Starting media file watcher for Rocky Mountain Weddings
echo This will monitor changes to media files and trigger live reload
echo Updates will be logged in src/assets/media-updates.log

cd /d D:\work\rockymountainweddings
npm run watch 