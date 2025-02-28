# Rocky Mountain Weddings Website
![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## What This Project Is
This is a dynamic wedding service website with automated media management. The site showcases Rocky Mountain Weddings services while featuring a built-in system that automatically tracks and updates media assets.

## Table of Contents
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Development Commands](#development-commands)
- [Automated Version Management](#automated-version-management)
- [How It Works](#how-it-works)
- [Working with AI Assistants](#working-with-ai-assistants)
- [Windows Terminal Integration](#windows-terminal-integration)
- [Deployment](#deployment)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Media Management**: Custom file watching system using Chokidar
- **Development Tools**: Concurrently for running multiple processes
- **Version Control**: Automated versioning with semantic versioning

## Project Structure
- `src/`: Source files
  - `assets/`: Media and backend files
    - `images/`: Website images (automatically tracked)
    - `videos/`: Website videos (automatically tracked) 
    - `log-api.js`: Main API entry point
    - `update-media-timestamp.js`: Handles media file changes
    - `media-updates.log`: Automated log of all media changes
  - `scripts/`: Frontend JavaScript 
  - `styles/`: CSS stylesheets
  - HTML pages (index.html, about.html, venues.html, blog.html, contact.html)
- `scripts/`: Helper PowerShell scripts for development
  - `update-version.ps1`: Automated version update script
  - `log-media-changes.ps1`: Media change logger
  - Other helper scripts
- `node_modules/`: Node.js dependencies
- Package configuration files (package.json)
- `version_history.txt`: Automatically updated version history
- `update-log.txt`: Logs of major updates

## Key Features
- **Dynamic Media Management**: Automatically detects when images or videos are added or modified
- **Logging API**: Tracks website activity and media changes
- **Responsive Design**: Works on mobile and desktop devices
- **SEO Optimized**: Structured for optimal search engine visibility
- **Performance Focused**: Optimized loading times and resource usage
- **Automated Versioning**: Full version control with semantic versioning (Major.Minor.Patch)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Windows with PowerShell 5.0+
- Visual Studio Code (recommended)

### Installation
1. Clone the repository (if applicable) or navigate to the project folder:
   ```
   cd D:\work\rockymountainweddings
   ```

2. Install dependencies:
   ```
   .\scripts\run-command.ps1 "npm install"
   ```

3. Set up your development environment:
   ```
   .\scripts\run-command.ps1 "npm run dev"
   ```

4. Open in your browser:
   ```
   http://localhost:3000
   ```

## Development Commands

### Standard NPM Commands
```
npm start         # Start the API server
npm run watch     # Watch for media file changes
npm run dev       # Run both server and file watcher
npm run update-version   # Run the version update script (requires -Description parameter)
npm run update-patch     # Increment patch version (e.g., 2.0.0 → 2.0.1)
npm run update-minor     # Increment minor version (e.g., 2.0.0 → 2.1.0)
npm run update-major     # Increment major version (e.g., 2.0.0 → 3.0.0)
```

### Helper Scripts
We've created PowerShell scripts to make development easier, especially when working with AI assistants:

#### Open Windows Terminal in Project
```
.\scripts\open-terminal.ps1
```

#### Run Project
```
.\scripts\start-project.ps1  # Same as npm start
```

#### Watch Media Files
```
.\scripts\watch-media.ps1  # Same as npm run watch
```

#### Execute Commands Safely
```
.\scripts\run-command.ps1 "command here"
```
This executes commands in the proper project context, reducing errors.

#### Quick File Access
```
.\scripts\open-file.ps1 [file-type]
```
Opens commonly accessed files:
- `index`, `about`, `blog`, `contact`: HTML pages
- `package`: package.json
- `style`: Main stylesheet
- `script`: Main JavaScript file

## Automated Version Management

The project includes a comprehensive version management system that automates updating version numbers, history files, and logs.

### One-Step Site Update

Need to update everything at once? Just use this simple command:

```
.\scripts\update-version.ps1 -Description "What you changed" -CommitChanges
```

This single command will:
- Update the version number in your project
- Record what you changed in the history files
- Update all necessary logs
- Save everything to Git automatically

It's like pressing a "Save and Publish" button for your entire project!

**Example:**
```
.\scripts\update-version.ps1 -Description "Added new wedding package pricing" -CommitChanges
```

That's it! No need to update multiple files or run several commands.

### How to Update Versions

#### Simple Version Updates
To update the version with npm scripts:
```
npm run update-patch -- -Description "Fixed navigation menu bug"
npm run update-minor -- -Description "Added photo gallery feature"
npm run update-major -- -Description "Complete redesign of website"
```

#### Advanced Version Control
For more control, use the PowerShell script directly:
```
.\scripts\update-version.ps1 -Description "Your change description" -Version "2.3.4"
.\scripts\update-version.ps1 -Description "Your change description" -Minor
.\scripts\update-version.ps1 -Description "Your change description" -CommitChanges
```

### What Gets Updated
When you run a version update:
1. **package.json version** is automatically incremented
2. **version_history.txt** gets a new entry with the current date
3. **update-log.txt** is updated with your description
4. Changes can be automatically committed to git with the `-CommitChanges` flag

### Automatic Media Logging
The system automatically logs all media file changes:
- Tracks when files are added, modified, or deleted
- Records image and video metadata
- Stores logs in `src/assets/media-updates.log`
- Provides clear timestamps for all changes

### Log File Locations
- **Version History**: `version_history.txt` in project root
- **Update Log**: `update-log.txt` in project root
- **Media Changes**: `src/assets/media-updates.log`

## How It Works

### Media Management System
1. The file watcher monitors the `/src/assets/images` and `/src/assets/videos` directories
2. When files are added or changed, `log-media-changes.ps1` is triggered
3. The script logs all changes and updates references
4. Changes are recorded in the media log file

#### Example: Adding a New Image
When you add a new image `wedding-venue.jpg` to `src/assets/images/venues/`:
```javascript
// The system automatically:
// 1. Detects the new file
// 2. Logs the addition with timestamp and file size
// 3. Makes it available via: /assets/images/venues/wedding-venue.jpg
// 4. Records the change in media-updates.log
```

### Development Workflow
1. Run `npm run dev` to start both the server and file watcher
2. Edit files in the `src` directory
3. Media changes are processed automatically
4. View the site through the local server
5. When ready to update the version, run the appropriate update command

## Working with AI Assistants
When working with AI tools:

1. **Share specific code snippets** rather than describing issues
2. Use the helper scripts to run commands: `.\scripts\run-command.ps1 "npm command"`
3. For complex operations, explain what you're trying to accomplish with the media system
4. When updating HTML files, ensure you maintain correct paths to CSS (`styles/`) and JavaScript (`scripts/`) files

### Example AI Interaction
```
User: "I need to add a new section to the homepage that shows upcoming wedding events"

AI: "I'll help you add that section. First, let's open the index.html file:
     .\scripts\open-file.ps1 index
     
     Then, add this code to create the events section... [code snippet]
     
     Finally, to update any dependencies:
     .\scripts\run-command.ps1 "npm install moment --save"
```

## Windows Terminal Integration
VS Code is configured to use Windows Terminal for a better development experience:
- Better terminal rendering
- Multiple tabs and panes
- Command history and search
- Customizable appearance

### Terminal Shortcuts
- **Open New Terminal**: Ctrl+Shift+`
- **Split Terminal**: Ctrl+Shift+5
- **Navigate Between Terminals**: Alt+Arrow Keys

## Deployment
The website is deployed using a simple and effective process:

1. **Build Process**:
   ```
   .\scripts\run-command.ps1 "npm run build"
   ```
   This creates optimized assets in the `dist` folder.

2. **Deployment Options**:
   - Manual FTP upload to hosting provider
   - Automated deployment via webhook (if set up)
   - Direct server copy for local hosting

3. **Production URL**: 
   - Development: http://localhost:3000
   - Production: https://rockymountainweddings.com (example)

## Browser Compatibility
The website is optimized for:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## Troubleshooting
- **Media not updating?** Check the console for errors in the file watcher
- **API not responding?** Verify the server is running with `npm start`
- **Dependency issues?** Run `.\scripts\run-command.ps1 "npm install"`
- **Port conflicts?** Check if port 3000 is already in use and modify in config
- **Version update fails?** Make sure you provide a -Description parameter

### Common Error Messages
- `Error: ENOENT: no such file or directory`: Check file paths and ensure they exist
- `Error: listen EADDRINUSE`: Another service is using the required port
- `SyntaxError: Unexpected token`: JavaScript syntax error in your code
- `ParameterBindingException`: Missing required parameter in version update command

Always run commands from the project root: `D:\work\rockymountainweddings`

## Version History
- **2.0.0**: Current version with dynamic media management
- **1.5.0**: Added responsive design and blog section
- **1.0.0**: Initial website launch

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

© 2025 Rocky Mountain Weddings. All rights reserved. 