/**
 * Simple Express server to handle logging API requests in development
 * This script is used when running the website locally to append front-end
 * logs to the media-updates.log file
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// API endpoint for logging media updates
app.post('/api/log-media-update', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const logFilePath = path.join(__dirname, 'media-updates.log');
        // Add a newline before the message
        fs.appendFileSync(logFilePath, `\n${message} [CLIENT]`, 'utf8');
        res.json({ success: true });
    } catch (err) {
        console.error('Error writing to log file:', err);
        res.status(500).json({ error: 'Failed to write to log file' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Development server running on http://localhost:${PORT}`);
    console.log(`Media log API endpoint available at http://localhost:${PORT}/api/log-media-update`);
}); 