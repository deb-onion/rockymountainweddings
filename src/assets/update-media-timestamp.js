/**
 * This script updates the lastUpdate timestamp in update-check.json
 * It's meant to be called by a file watcher or build process
 */

const fs = require('fs');
const path = require('path');

// Path to the update-check.json file
const updateCheckPath = path.join(__dirname, 'update-check.json');
const logFilePath = path.join(__dirname, 'media-updates.log');

// Get the file path that was changed (passed by the watcher)
const changedFile = process.argv[2] || 'Unknown file';
const relativeChangedFile = changedFile.replace(/.*?(src\/assets\/(images|videos)\/.*)/i, '$1');

// Get current date and time
const timestamp = new Date();

// Read the current file
let updateData = { lastUpdate: timestamp.getTime() };
try {
    const fileContent = fs.readFileSync(updateCheckPath, 'utf8');
    updateData = JSON.parse(fileContent);
    // Update the timestamp
    updateData.lastUpdate = timestamp.getTime();
} catch (err) {
    // File doesn't exist or is invalid, use default
    console.log('Creating new update-check.json file');
}

// Write the updated file
fs.writeFileSync(
    updateCheckPath, 
    JSON.stringify(updateData, null, 4),
    'utf8'
);

// Log the update to the media-updates.log file
try {
    const logEntry = `\n[${timestamp.toLocaleString()}] - Updated: ${relativeChangedFile}`;
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
    console.log(`Added entry to log: ${logEntry}`);
} catch (err) {
    console.error('Error writing to log file:', err);
}

console.log(`Updated timestamp: ${timestamp.toISOString()}`); 